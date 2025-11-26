const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./db.json";

if (!fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, []);
}

app.get("/", (req, res) => {
  res.send("Developer Directory Backend is running");
});

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
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/developers", async (req, res) => {
  try {
    const developers = await fs.readJson(DATA_FILE);
    res.json(developers);
  } catch {
    res.status(500).json({ message: "Error fetching developers" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
