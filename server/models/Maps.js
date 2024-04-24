const mongoose = require("mongoose");

// Define the User schema
const MapsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  scale: {
    type: String,
    required: false
  },
  spawners: {
    type: Array,
    required: false
  },
  traps: {
    type: Array,
    required: false
  },
  walls: {
    type: Array,
    required: false
  },
  doors: {
    type: Array,
    required: false
  },
  
  
},{ collection: 'maps' });


const Maps = mongoose.model("Maps", MapsSchema);


module.exports = Maps;