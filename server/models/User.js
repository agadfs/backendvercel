const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure emails are unique
  },
  password: {
    type: String,
    required: true
  },
  isOn: {
    type: Boolean,
    required: false
  },
  lastActiveAt: { 
    type: Date,
    required:false
  },
  charCreate: { 
    type: Array,
    required:false
  },
  premium: { 
    type: Boolean,
    required:false
  },
  creator: { 
    type: Boolean,
    required:false
  },
  Admin: { 
    type: Boolean,
    required:false
  },

  
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;