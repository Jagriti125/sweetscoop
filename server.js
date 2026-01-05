const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const port = 5000;

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(bodyParser.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ------------------- MYSQL CONNECTION -------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kashika212M123",
    database: "sweet_scoops"
});

db.connect((err) => {
    if (err) {
        console.log("❌ MySQL Connection Error:", err);
    } else {
        console.log("✅ Connected to MySQL");
    }
});

// ------------------- AUTH ROUTES -------------------

// SIGNUP
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(query, [name, email, hashedPassword], (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.json({ success: false, msg: "Email already registered!" });
                }
                return res.json({ success: false, msg: "Database error" });
            }
            res.json({ success: true, msg: "Signup successful!" });
        });
    } catch {
        res.json({ success: false, msg: "Server error" });
    }
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err, results) => {
        if (err) return res.json({ success: false, msg: "Database error" });
        if (results.length === 0) return res.json({ success: false, msg: "User not found!" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.json({ success: false, msg: "Incorrect password!" });

        // ✅ Frontend stores name in localStorage
        res.json({
            success: true,
            msg: `Welcome back, ${user.name}!`,
            name: user.name
        });
    });
});

// ------------------- ORDER ROUTES -------------------

// SAVE ORDER (CHECKOUT)
app.post("/api/orders", (req, res) => {
    const { username, items, total } = req.body;

    if (!username || !items || !total) {
        return res.status(400).json({ error: "Missing order data" });
    }

    const sql =
        "INSERT INTO orders (username, items, total, status) VALUES (?, ?, ?, 'Placed')";

    db.query(sql, [username, items, total], (err) => {
        if (err) {
            console.error("❌ Order Insert Error:", err);
            return res.status(500).json({ error: "Order failed" });
        }
        res.json({ success: true, message: "Order placed successfully" });
    });
});

// GET ORDER HISTORY (PROFILE PAGE)
app.get("/api/orders/:username", (req, res) => {
    const username = req.params.username;

    const sql =
        "SELECT * FROM orders WHERE username = ? ORDER BY created_at DESC";

    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error("❌ Fetch Orders Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result);
    });
});

// ------------------- PAGE ROUTES -------------------

// Serve login page by default
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Redirect /home to index.html
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------- START SERVER -------------------
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
