import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load JSON once when server starts
const cropGuides = JSON.parse(
  readFileSync(join(__dirname, "../data/cropGuides.json"), "utf-8")
);

router.get("/:cropName", (req, res) => {
  const cropName = req.params.cropName.toLowerCase().trim();

  // Try exact match first
  if (cropGuides[cropName]) {
    return res.json({ success: true, guide: cropGuides[cropName] });
  }

  // Try partial match (e.g. "kidney beans" → "kidneybeans")
  const normalised = cropName.replace(/\s+/g, "");
  const match = Object.keys(cropGuides).find(
    (key) => key.replace(/\s+/g, "") === normalised
  );

  if (match) {
    return res.json({ success: true, guide: cropGuides[match] });
  }

  return res.status(404).json({
    success: false,
    error: `No guide found for "${cropName}"`
  });
});

export default router;