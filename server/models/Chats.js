const mongoose = require("mongoose");

// Define the User schema
const chatsSchema = new mongoose.Schema({
  users: {
    type: Array,
    required: false
  },
  usersmessages:{
    type:Array,
    required:false
  },
  lasttimeonline:{
    type:Array,
    required:false
  },
  idseenmsg:{
    type:Array,
    required:false
  }

  
});


const chats = mongoose.model("chats", chatsSchema);

module.exports = chats;