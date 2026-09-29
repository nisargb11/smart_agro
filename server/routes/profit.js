import express from "express";
import axios from "axios";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const economics = JSON.parse(
  readFileSync(join(__dirname, "../data/cropEconomics.json"), "utf-8")
);

const CROP_EMOJI = {
  rice: "🌾", maize: "🌽", chickpea: "🫘", kidneybeans: "🫘",
  pigeonpeas: "🫘", mothbeans: "🫘", mungbean: "🫘", blackgram: "🫘",
  lentil: "🫘", pomegranate: "🍎", banana: "🍌", mango: "🥭",
  grapes: "🍇", watermelon: "🍉", muskmelon: "🍈", apple: "🍎",
  orange: "🍊", papaya: "🍈", coconut: "🥥", cotton: "🌿",
  jute: "🌿", coffee: "☕",
};

router.post("/", async (req, res) => {
  try {
    const { nitrogen, phosphorous, potassium, temperature, humidity, ph, rainfall } = req.body;

    // Validate inputs
    const fields = { nitrogen, phosphorous, potassium, temperature, humidity, ph, rainfall };
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({ success: false, error: `Missing field: ${key}` });
      }
    }

    // Get ML recommendations from Flask
    const flaskResponse = await axios.post("http://localhost:5000/predict", {
      nitrogen: parseFloat(nitrogen),
      phosphorous: parseFloat(phosphorous),
      potassium: parseFloat(potassium),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      ph: parseFloat(ph),
      rainfall: parseFloat(rainfall),
    });

    const mlPredictions = flaskResponse.data.predictions;

    // Calculate profit for each crop
    const results = mlPredictions.map((pred, idx) => {
      const cropKey   = pred.crop.toLowerCase().replace(/\s+/g, "");
      const econ      = economics[cropKey] || economics[pred.crop.toLowerCase()];

      if (!econ) {
        return {
          rank: idx + 1,
          crop: pred.crop,
          emoji: CROP_EMOJI[cropKey] || "🌱",
          suitability_score: pred.confidence,
          revenue_per_acre: null,
          cost_per_acre: null,
          profit_per_acre: null,
          roi_percent: null,
          duration_days: null,
          combined_score: pred.confidence,
          recommendation: "Suitability data available but economic data not found"
        };
      }

      const revenue     = econ.price_per_quintal * econ.yield_quintal_per_acre;
      const cost        = econ.cost_per_acre;
      const profit      = revenue - cost;
      const roi         = ((profit / cost) * 100).toFixed(1);

      // Normalize profit to 0-100 scale for scoring
      // Max profit reference: ~₹90,000 (grapes)
      const profitScore = Math.min((profit / 90000) * 100, 100);

      // Combined score: 60% suitability + 40% profit
      const combinedScore = (pred.confidence * 0.6) + (profitScore * 0.4);

      return {
        rank: idx + 1,
        crop: pred.crop,
        emoji: CROP_EMOJI[cropKey] || "🌱",
        suitability_score: parseFloat(pred.confidence.toFixed(1)),
        revenue_per_acre: revenue,
        cost_per_acre: cost,
        profit_per_acre: profit,
        roi_percent: parseFloat(roi),
        duration_days: econ.duration_days,
        combined_score: parseFloat(combinedScore.toFixed(1)),
        recommendation: profit > 30000
          ? "High profit potential"
          : profit > 15000
          ? "Moderate profit potential"
          : "Low profit potential"
      };
    });

    // Re-rank by combined score
    results.sort((a, b) => b.combined_score - a.combined_score);
    results.forEach((r, i) => r.rank = i + 1);

    return res.json({ success: true, results });

  } catch (error) {
    console.error("Profit route error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;