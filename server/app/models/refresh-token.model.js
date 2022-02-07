const mongoose = require("mongoose");

const schema =new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String
});

schema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired;
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
      delete ret.id;
      delete ret.user;
  }
});

const RefreshToken = mongoose.model(
  "RefreshToken",
  schema
);

module.exports = RefreshToken;