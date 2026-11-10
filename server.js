
const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database
const db = new Database("database.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        bio TEXT,
        skills TEXT,
        social TEXT
    )
`);

// Save profile
app.post("/api/profiles", (req, res) => {
    const { name, bio, skills, social } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    const stmt = db.prepare(`
        INSERT INTO profiles (name, bio, skills, social)
        VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
        name.trim(),
        bio || "",
        skills || "",
        social || ""
    );

    res.status(201).json({
        message: "Profile created successfully!",
        id: result.lastInsertRowid
    });
});

// Get all profiles
app.get("/api/profiles", (req, res) => {
    const profiles = db.prepare(
        "SELECT * FROM profiles ORDER BY id DESC"
    ).all();

    res.json(profiles);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
