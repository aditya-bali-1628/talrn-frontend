const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");

const app = express();

// Enable CORS for all requests
app.use(
  cors({
    origin: "*", // allow all origins for now
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const DATA_FILE = "./db.json";

// Ensure db.json exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, []);
}

// Root route
app.get("/", (req, res) => {
  res.send("Developer Directory Backend is running");
});

// POST → Add a developer
app.post("/developers", async (req, res) => {
  try {
    const developers = await fs.readJson(DATA_FILE);
    const { name, role, techStack, experience } = req.body;

    if (!name || !role || !techStack || !experience) {
      return res.status(400).json({ message: "All fields are required" });
    }

    developers.push({ name, role, techStack, experience });
    await fs.writeJson(DATA_FILE, developers);
    res.status(201).json({ message: "Developer added successfully" });
  } catch (err) {
    console.error("Error adding developer:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET → Fetch all developers
app.get("/developers", async (req, res) => {
  try {
    const developers = await fs.readJson(DATA_FILE);
    res.json(developers);
  } catch (err) {
    console.error("Error fetching developers:", err);
    res.status(500).json({ message: "Error fetching developers" });
  }
});

// ✅ Important: use process.env.PORT for Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Backend running on port ${PORT}`)
);
