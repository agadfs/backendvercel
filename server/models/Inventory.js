const mongoose = require("mongoose");

// Define the User schema
const InventorySchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true
  },
  gameId: {
    type: String,
    required: true
  },
  Items: {
    type: Array,
    required: false,
   
  },
  Stats: {
    type: Object,
    required: false,
   
  },
  Isnpc: {
    type: Boolean,
    required: false,
   
  },
  Npcname:{
    type: String,
    required: false
  },
  NpcUrlPhoto:{
    type: String,
    required: false
  },
  NpcBook:{
    type: String,
    required: false
  }

  
},{ collection: 'Inventory' });


const Inventory = mongoose.model("Inventory", InventorySchema);


module.exports = Inventory;