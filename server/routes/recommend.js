import express from "express";
import axios from "axios";

const router = express.Router();

const FLASK_URL = "http://localhost:5000";

router.post("/", async (req, res) => {
  try {
    const { nitrogen, phosphorous, potassium, temperature, humidity, ph, rainfall } = req.body;

    const fields = { nitrogen, phosphorous, potassium, temperature, humidity, ph, rainfall };

    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({ success: false, error: `Missing field: ${key}` });
      }
    }

    const flaskResponse = await axios.post(`${FLASK_URL}/predict`, fields);

    return res.json({
      success: true,
      predictions: flaskResponse.data.predictions
    });

  } catch (error) {
    console.error("Recommend route error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.error || "Could not connect to ML service. Make sure Flask is running on port 5000.",
    });
  }
});

export default router;