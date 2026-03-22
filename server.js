const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // Serve static files (HTML, CSS, JS)

// In-memory storage for history (replaces MongoDB)
let userHistory = [];

// Simple JS KMeans-like prediction (mimics clustering.py)
function predictClothing(age, budget) {
  // Centroids from clustering.py sample data (approx)
  const centroids = [
    [22.5, 1500],  // Cluster 0: Casual
    [27.5, 3500],  // Cluster 1: Formal
    [35, 6000]     // Cluster 2: Premium
  ];

  let minDist = Infinity;
  let cluster = 0;

  for (let i = 0; i < centroids.length; i++) {
    const dist = Math.sqrt(
      Math.pow(age - centroids[i][0], 2) + Math.pow(budget - centroids[i][1], 2)
    );
    if (dist < minDist) {
      minDist = dist;
      cluster = i;
    }
  }

  const categories = ["Casual Wear", "Formal Wear", "Premium Wear"];
  return categories[cluster];
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/predict", (req, res) => {
  try {
    const { age, gender, budget } = req.body;

    if (!age || !budget || age < 0 || budget < 0) {
      return res.status(400).json({ error: "Invalid age or budget" });
    }

    const recommendation = predictClothing(parseInt(age), parseFloat(budget));

    // Save to history
    const userData = { age: parseInt(age), gender, budget: parseFloat(budget), recommendation, timestamp: new Date().toISOString() };
    userHistory.push(userData);

    res.json({ recommendation });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/history", (req, res) => {
  res.json(userHistory);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
