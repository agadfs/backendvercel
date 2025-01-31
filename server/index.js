const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require('body-parser');
const app = express();

app.use(cors());

app.use(bodyParser.json());

const connectDB = require("./connectMongo");

connectDB();

const User = require('./models/User');
const Session = require("./models/Session");
const Inventory = require("./models/Inventory");
const Item = require("./models/Item");
const npcs = require("./models/Npc");
const chats = require("./models/Chats");
const Maps = require("./models/Maps");



app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/users", async (req, res) => {
  try {
    const email = req.query.email;
    const password = req.query.password;
    const users = await User.find({ email, password });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/userscountonline", async (req, res) => {
  try {

    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);


    const users = await User.find({ lastActiveAt: { $gte: tenSecondsAgo } });
    const count = users.length;

    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/userscount", async (req, res) => {
  try {

    const users = await User.find();
    const count = users.length;
    res.status(200).json(count);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/heartbeat', async (req, res) => {
  try {
    const { userId, ...userData } = req.body;
    const user = await User.findByIdAndUpdate(userId, { $set: userData, isOn: true }, { new: true, upsert: true });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error upserting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.post("/sessions", async (req, res) => {
  
  try {
    const newSession = new Session(req.body);
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/sessions", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/sessions/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/sessions/delete/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await Session.findByIdAndDelete(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/sessions/update/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const updateData = req.body; 
    
    
    const session = await Session.findByIdAndUpdate(sessionId, { $set: updateData }, { new: true, upsert: true });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/users/update/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const updateData = req.body; 
    
    
    const session = await User.findByIdAndUpdate(sessionId, { $set: updateData }, { new: true, upsert: true });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/inventory/:inventoryUserId/:inventoryGameId", async (req, res) => {
  try {
    const userId = req.params.inventoryUserId;
    const gameId = req.params.inventoryGameId;
   
    const user = await Inventory.find({ ownerId:userId, gameId:gameId });
    
    if (!user) {
      return res.status(404).json({ error: "Inventory not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/inventory/create", async (req, res) => {
  try {
    

    const newUser = new Inventory(req.body);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/item", async (req, res) => {
  
  try {
    const newItem = new Item(req.body);
    console.log(newItem)
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating Item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/item", async (req, res) => {
  try {
    const sessions = await Item.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/inventory/updateitems', async (req, res) => {
  try {
    const { userId, items, Stats } = req.body; 
    
   
    const user = await Inventory.findByIdAndUpdate(userId, { Items: items, Stats: Stats });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error updating user's inventory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/npcsupdate', async (req, res) => {
  try {
    const { userId, items, Stats } = req.body; 
    
   
    const user = await Inventory.findByIdAndUpdate(userId, { Items: items, Stats: Stats });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error updating user's inventory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/npcsupdate/:sessionId", async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const updateData = req.body; 
    
    
    const session = await npcs.findByIdAndUpdate(sessionId, { $set: updateData }, { new: true, upsert: true });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/npcscreate", async (req, res) => {
  
  try {
    const newItem = new npcs(req.body);
    console.log(newItem)
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating Item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/npcsGET", async (req, res) => {
  
  try {
    const sessions = await npcs.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/sendFriendRequest/:id", async (req, res) => {
  
  try {
    const sessionId = req.params.id;
    const updateData = req.body; 
    const session = await User.findByIdAndUpdate(sessionId, { $push:{FriendsRequests: updateData }}, { new: true});

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/manageFriendRequest/:id/:decision/:targetedid", async (req, res) => {
  
  try {
    const sessionId = req.params.id;
    const decision = req.params.decision;
    const targetedId = req.params.targetedid;
    
    const session = await User.findByIdAndUpdate(sessionId, { $pull:{ FriendsRequests: {idrequest: targetedId}}}, { new: true});
    if(decision === 'accept'){
      let friendname = await User.findById(targetedId);
      let yourname = await User.findById(sessionId);
      const befriendof = await User.findByIdAndUpdate(targetedId, { $push:{ Friends: {friendid: sessionId, friendsname:yourname.username}}}, { new: true});
      const addfriend = await User.findByIdAndUpdate(sessionId, { $push:{ Friends: {friendid: targetedId, friendsname:friendname.username}}}, { new: true});
    }


    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.status(200).json(session, targetedId, decision);
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/loadmessages/:yourid/:friendid", async (req, res) => {
  try {
    const requserid = req.params.yourid;
    const frienduserid = req.params.friendid;

   
    let chat = await chats.findOne({ users: { $all: [requserid, frienduserid] } });

    if (!chat) {
      chat = new chats({ users: [requserid, frienduserid], usersmessages: [] });
      await chat.save();
    }

    // Send the chat's messages
    res.status(200).json(chat.usersmessages);
  } catch (error) {
    console.error("Error loading messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/sendmessage/:yourid/:friendid", async (req, res) => {
  try {
    const requserid = req.params.yourid;
    const frienduserid = req.params.friendid;
    const message = req.body.message; 

    
    let chat = await chats.findOne({ users: { $all: [requserid, frienduserid] } });

   
    if (!chat) {
      chat = new chats({ users: [requserid, frienduserid], usersmessages: [message] });
    } else {
     
      chat.usersmessages.push(message);
    }

   
    await chat.save();

    
    res.status(200).json(chat.usersmessages);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/mapcreate", async (req, res) => {
  try {
   
    await Maps.findOneAndDelete(req.body);

   
    const newItem = new Maps(req.body);
    console.log(newItem);
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating Map:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/mapget", async (req, res) => {
  try {
    const name = req.query.name;
    const url = req.query.url;
    const id = req.query.id;
    const sessions = await Maps.findOne({ name: name, url: url, id: id });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});