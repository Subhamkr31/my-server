const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
  password: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

// Create User model from the schema
const User = mongoose.model('Register', userSchema);

module.exports = User;
