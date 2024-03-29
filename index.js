const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const PORT = 5000;
console.log(process.env)
const URL = process.env.Database
//"mongodb+srv://deepak:deepak@cluster0.3t4az4g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" // Replace with your MongoDB connection string

app.use(express.json());

const mentors = [];

app.get('/',(req,res)=>{
    res.send(mentors)
})

app.post("/students", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = connection.db("yourDatabaseName"); // Replace with your database name
    const result = await db.collection("mentors").insertOne(req.body);
    connection.close();
    res.json({ message: "Mentor created successfully", id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = connection.db("yourDatabaseName"); // Replace with your database name
    const result = await db.collection("students").insertOne(req.body);
    connection.close();
    res.json({ message: "Student created successfully", id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/assign", async (req, res) => {
  try {
    const { mentorId, studentId } = req.body;
    const connection = await MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = connection.db("yourDatabaseName"); // Replace with your database name

    const mentorsCollection = db.collection("mentors");
    const studentsCollection = db.collection("students");

    const mentor = await mentorsCollection.findOne({ _id: ObjectId(mentorId) });
    const student = await studentsCollection.findOne({ _id: ObjectId(studentId) });

    if (mentor && student) {
      await studentsCollection.updateOne({ _id: ObjectId(studentId) }, { $set: { mentorId: ObjectId(mentorId) } });
      connection.close();
      res.json({
        success: true,
        message: `Student ${student.name} assigned to Mentor ${mentor.name}`,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid mentor or student ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/mentors", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = connection.db("yourDatabaseName"); // Replace with your database name
    const mentors = await db.collection("mentors").find({}).toArray();
    connection.close();
    res.json(mentors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/students", async (req, res) => {
  try {
    const connection = await MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = connection.db("yourDatabaseName"); // Replace with your database name
    const students = await db.collection("students").find({}).toArray();
    connection.close();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Other routes...

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
