// load the things we need
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const favoriteSchema = {
  name: { type: String, unique: true, index: true },
};

// define the schema for our user model
const userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String,
  },
  favorites: [favoriteSchema],
});

// generating a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
