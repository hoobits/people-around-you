const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const dbConfig = require("./app/config/db.config");
const authConfig = require("./app/config/auth.config");

const PORT = process.env.PORT || 3001;
const app = express();
const urlencodeParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.json(), urlencodeParser);
app.use(cookieParser(authConfig.cookieParserSecret));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const dbURI = dbConfig.uri;

const db = require("./app/models");
const Role = db.role;
db.mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((res) => {
  console.log("Connected to the database!");
  initial();
}).catch(err => {
  console.log("Cannot connect to the database!", err);
  process.exit();
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}