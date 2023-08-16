const express = require('express');
const app = express();

const mongoose = require('mongoose');
const { string } = require('prop-types');
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mydb2", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to database");
  })
  .catch(err => {
    console.error("Error connecting to database:", err);
  });

//schema for mongodb
const schema = {
    name: String,
    email: String,
    id: Number
}

//attaching schema to mongoose model
const mongomodel = mongoose.model("users2", schema);

const server = app;

app.post("/post", async (req, res) => {
    console.log("inside post function");

    const data = new mongomodel({
        name: req.body.name,
        email: req.body.email,
        id: req.body.id
    });
    

    const val = await data.save();
    res.send("posted");
})

app.put("/update/:id", async (req, res) => {
let upid = req.params.id;
let upname = req.body.name;
let upemail = req.body.email;

try {
const updatedData = await mongomodel.findOneAndUpdate(
 { id: upid },
{ $set: { name: upname, email: upemail } },
{ new: true }
);

 if (updatedData === null) {
 res.send("Nothing found");
} else {
 res.send(updatedData);
}
} catch (error) {
console.error("Error updating document:", error);
 res.status(500).send("Internal Server Error");
 }
});

app.get("/users", async (req, res) => {
   try {
 const users = await mongomodel.find(); // Retrieve all users
  
   if (users.length === 0) {
   res.send("No users found");
    } else {
     res.send(users);
    }
  } catch (error) {
  console.error("Error retrieving users:", error);
   res.status(500).send("Internal Server Error");
 }
  });

app.listen(3007, () => {
  console.log("on post 3007");
});

module.exports = app; // Export the app instance