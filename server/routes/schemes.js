import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const data = JSON.parse(
  readFileSync(join(__dirname, "../data/governmentSchemes.json"), "utf-8")
);

// Get all schemes or filter by category
router.get("/", (req, res) => {
  const { category, search } = req.query;

  let schemes = data.schemes;

  // Filter by category
  if (category && category !== "all") {
    schemes = schemes.filter(s => s.category === category);
  }

  // Filter by search
  if (search) {
    const q = search.toLowerCase();
    schemes = schemes.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q))
    );
  }

  return res.json({
    success: true,
    total: schemes.length,
    categories: data.categories,
    schemes
  });
});

// Get single scheme by id
router.get("/:id", (req, res) => {
  const scheme = data.schemes.find(s => s.id === parseInt(req.params.id));
  if (!scheme) {
    return res.status(404).json({ success: false, error: "Scheme not found" });
  }
  return res.json({ success: true, scheme });
});

export default router;