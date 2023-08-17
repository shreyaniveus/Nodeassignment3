const express = require('express');
const app = express();
const mongoose = require('mongoose');
const winston = require('winston');

app.use(express.json());

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info', // Set the minimum log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'app.log' }) // Log all levels to a single file
  ]
});

mongoose.connect("mongodb://localhost:27017/mydb2", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    logger.info("Connected to database");
  })
  .catch(err => {
    logger.error("Error connecting to database:", err);
  });

const schema = {
  name: String,
  email: String,
  id: Number
}

const mongomodel = mongoose.model("users2", schema);

app.post("/post", async (req, res) => {
  logger.info("Inside post function");

  const { name, email, id } = req.body;

  if (!name || !email || !id) {
    logger.error("Empty fields found in the request");
    return res.status(400).json({ message: 'Empty fields found' });
  }

  try {
    const existingUser = await mongomodel.findOne({ email });

    if (existingUser) {
      logger.error("User with the provided email already exists");
      return res.status(400).send({ message: 'User alredy exists' });
    }

    const data = new mongomodel({
      name: name,
      email: email,
      id: id
    });

    const savedData = await data.save();
    logger.info("Data saved:", savedData);
    res.status(200).send(savedData); // Use 201 for resource created
  } catch (error) {
    logger.error("Error saving data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/update/:id", async (req, res) => {
  const upid = req.params.id;
  const upname = req.body.name;
  const upemail = req.body.email;

  try {
    const updatedData = await mongomodel.findOneAndUpdate(
      { id: upid },
      { $set: { name: upname, email: upemail } },
      { new: true }
    );

    if (updatedData === null) {
      logger.error("No data found for update");
      return res.status(404).send({message: 'Nothing found'});
    } else {
      logger.info("Data updated:", updatedData);
      res.send(updatedData);
    }
  } catch (error) {
    logger.error("Error updating document:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await mongomodel.find();

    if (users.length === 0) {
      logger.info("No users found");
      res.send("No users found");
    } else {
      logger.info("Users retrieved:", users);
      res.send(users);
    }
  } catch (error) {
    logger.error("Error retrieving users:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 3007;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
