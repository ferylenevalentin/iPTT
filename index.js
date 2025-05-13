const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Student = require("./models/student.model");
const User = require("./models/user.model");

const app = express();
app.use(cors());
app.use(express.json());


mongoose
    .connect("mongodb://localhost:27017/StudentInformationSystem")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));


app.get("/fetchstudents", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

// Add Student Route
app.post("/addstudentmongo", async (req, res) => {
    const newStudent = req.body;

    try {
        const student = new Student(newStudent);
        await student.save();
        res.status(201).json(student);
        console.log("Added Student:", student);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "ID Number already exists. Please use a unique ID." });
        } else {
            console.error("Error adding student:", error);
            res.status(500).json({ message: "Error adding student" });
        }
    }
});

// Update Student Route
app.put("/updatestudent/:id", async (req, res) => {
    const { id } = req.params;
    const updatedStudent = req.body;

    try {
        const student = await Student.findOneAndUpdate({ id: id }, updatedStudent, { new: true });
        if (student) {
            res.json({ message: "Student updated successfully", updatedStudent: student });
            console.log("Updated Student:", student);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Error updating student" });
    }
});

// Delete Student Route
app.delete("/deletestudent/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findOneAndDelete({ id: id });
        if (student) {
            res.json({ message: "Student deleted successfully" });
            console.log("Deleted Student ID:", id);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Error deleting student" });
    }
});

// Sign Up Route
app.post("/signup", async (req, res) => {
    const { userId, firstName, lastName, middleName, email, password } = req.body;

    if (!userId || !firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Normalize email and userId
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUserId = userId.trim();

        // Check if the email or userId already exists
        const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { userId: normalizedUserId }] });
        console.log("Existing User Found:", existingUser);
        if (existingUser) {
            return res.status(400).json({ message: "Email or ID already exists." });
        }

        // Create a new user
        const newUser = new User({
            userId: normalizedUserId,
            firstName,
            lastName,
            middleName,
            email: normalizedEmail,
            password,
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully." });
        console.log("Added User:", newUser);
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Error signing up." });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate a mock token (you can replace this with JWT for real-world use)
        const token = `mock-token-${user._id}`;
        res.json({ token, role: user.userType });
        console.log("User logged in:", user);
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in." });
    }
});

// Fetch Users Route
app.get("/fetchusers", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users." });
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Student Information System API!");
});

// Start the Server
const port = 1337;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});