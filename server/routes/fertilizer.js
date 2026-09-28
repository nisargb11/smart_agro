import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const guides = JSON.parse(
  readFileSync(join(__dirname, "../data/fertilizerGuides.json"), "utf-8")
);

// ── Classify each nutrient ────────────────────────────────────────────────────
const classifyNutrient = (value, low, high) => {
  if (value < low) return "low";
  if (value > high) return "high";
  return "optimal";
};

const classifyPH = (ph) => {
  if (ph < 5.5) return "acidic";
  if (ph > 7.5) return "alkaline";
  return "optimal";
};

router.post("/", (req, res) => {
  try {
    const { nitrogen, phosphorous, potassium, ph } = req.body;

    // Validate inputs
    if ([nitrogen, phosphorous, potassium, ph].some(v => v === undefined || v === null || v === "")) {
      return res.status(400).json({ success: false, error: "Missing required soil parameters" });
    }

    const N = parseFloat(nitrogen);
    const P = parseFloat(phosphorous);
    const K = parseFloat(potassium);
    const PH = parseFloat(ph);

    // Classify each nutrient
    const nStatus  = classifyNutrient(N, 20, 80);
    const pStatus  = classifyNutrient(P, 10, 50);
    const kStatus  = classifyNutrient(K, 10, 80);
    const phStatus = classifyPH(PH);

    // Build overall soil health score (0–100)
    const score = [
      nStatus === "optimal" ? 25 : nStatus === "low" ? 10 : 5,
      pStatus === "optimal" ? 25 : pStatus === "low" ? 10 : 5,
      kStatus === "optimal" ? 25 : kStatus === "low" ? 10 : 5,
      phStatus === "optimal" ? 25 : 10,
    ].reduce((a, b) => a + b, 0);

    const overallHealth =
      score >= 80 ? "Excellent" :
      score >= 60 ? "Good" :
      score >= 40 ? "Fair" : "Poor";

    return res.json({
      success: true,
      inputs: { nitrogen: N, phosphorous: P, potassium: K, ph: PH },
      results: {
        nitrogen:    { value: N,  level: nStatus,  ...guides.nitrogen[nStatus] },
        phosphorous: { value: P,  level: pStatus,  ...guides.phosphorous[pStatus] },
        potassium:   { value: K,  level: kStatus,  ...guides.potassium[kStatus] },
        ph:          { value: PH, level: phStatus, ...guides.ph[phStatus] },
      },
      soilHealth: { score, status: overallHealth }
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;