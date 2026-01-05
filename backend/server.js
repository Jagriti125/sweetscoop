const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔥 Correct Public Path
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

console.log("Serving Public Folder:", publicPath);

// ------------------ DEFAULT ROUTES ------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});

// ------------------ DB CONNECTION ------------------
mongoose.connect("mongodb://127.0.0.1:27017/sweetscoops", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ------------------ USER SCHEMA ------------------
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model("User", UserSchema);

// ------------------ SIGNUP API ------------------
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const usedEmail = await User.findOne({ email });
    if (usedEmail) return res.json({ success: false, msg: "Email already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    res.json({ success: true, msg: "Account created successfully" });
});

// ------------------ LOGIN API ------------------
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "Email not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, msg: "Incorrect password" });

    res.json({ success: true, msg: "Login successful", user });
});

// ------------------ START SERVER ------------------
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
