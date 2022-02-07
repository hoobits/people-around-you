const authConfig = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const ipAddress = req.ip;
      const refreshToken = generateRefreshToken(user, ipAddress);
      refreshToken.save((err, refreshToken) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        const details = processAuth(user, res, refreshToken);
        res.status(200).send(details);
      });

    });
};

exports.refreshToken = async (req, res) => {
  const token = req.signedCookies[authConfig.refreshTokenName];
  const ipAddress = req.ip;
  const refreshToken = await getRefreshToken(token);
  if (!refreshToken) {
    res.status(404).send({ message: "Invalid token." });
    return;
  }
  const { user } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  const details = processAuth(user, res, refreshToken);
  res.status(200).send(details);
}

function processAuth(user, res, refreshToken) {
  var authorities = [];

  for (let i = 0; i < user.roles.length; i++) {
    authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
  }

  const cookieOptions = {
    expires: refreshToken.expires,
    httpOnly: true,
    //overwrite: true,
    secure: false,
    signed: true,
  };
  res.cookie(
    authConfig.refreshTokenName,
    refreshToken.token,
    cookieOptions
  );
  const jwtToken = generateJwtToken(user);

  return {
    username: user.username,
    roles: authorities,
    accessToken: jwtToken,
    tokenExpiry: authConfig.expiration
  };
}

async function getRefreshToken(token) {
  const refreshToken = await RefreshToken.findOne({ token }).populate({
    path: 'user',
    populate: ({ path: 'roles' })
  });
  if (!refreshToken || !refreshToken.isActive) return false;
  return refreshToken;
}

function generateJwtToken(user) {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: authConfig.jwtExpiration
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

function generateRefreshToken(user, ipAddress) {
  const rememberMe = null;
  const delay = rememberMe
    ? authConfig.rememberRefreshTokenExpiration * 1000
    : authConfig.refreshTokenExpiration * 1000;
  const tokenExpires = new Date(new Date().getTime() + delay);

  return new RefreshToken({
      user: user.id,
      token: randomTokenString(),
      expires: tokenExpires,
      createdByIp: ipAddress
  });
}