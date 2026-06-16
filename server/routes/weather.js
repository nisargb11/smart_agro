import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const KEY = process.env.WEATHER_API_KEY;

if (!KEY) console.warn("⚠️  WEATHER_API_KEY is not set");

router.get("/current", async (req, res) => {
  const { city = "Mumbai" } = req.query;
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      { params: { q: city, units: "metric", appid: KEY } }
    );

    const { main, rain, sys, wind, weather } = response.data;
    res.json({
      temperature: main.temp,
      humidity: main.humidity,
      rainfall: rain?.["1h"] || 0,
      windSpeed: wind.speed,
      condition: weather[0].main,
      description: weather[0].description,
      sunrise: new Date(sys.sunrise * 1000).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit",
      }),
      sunset: new Date(sys.sunset * 1000).toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit",
      }),
    });
  } catch (error) {
    console.error("current weather error:", error.message);
    res.status(500).json({ error: "Failed to fetch current weather" });
  }
});

router.get("/user-city", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ city: user.city });
  } catch (error) {
    console.error("user-city error:", error);
    res.status(500).json({ error: "Failed to fetch user city" });
  }
});

router.get("/forecast", async (req, res) => {
  const city = req.query.city?.trim();
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const [forecastRes, currentRes] = await Promise.all([
      axios.get("https://api.openweathermap.org/data/2.5/forecast", {
        params: { q: city, units: "metric", appid: KEY },
      }),
      axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { q: city, units: "metric", appid: KEY },
      }),
    ]);

    const { sys } = currentRes.data;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });

    const byDate = {};
    for (const item of forecastRes.data.list) {
      const [date, time] = item.dt_txt.split(" ");
      if (!byDate[date] || time === "12:00:00") byDate[date] = item;
    }

    const daily = Object.values(byDate).map((item) => ({
      date: item.dt_txt.split(" ")[0],
      temp: item.main.temp,
      temp_min: item.main.temp_min,   
      condition: item.weather[0].main,
      description: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      pop: Math.round((item.pop || 0) * 100), 
      icon: item.weather[0].icon,
    }));

    res.json({
      city: forecastRes.data.city.name,
      country: forecastRes.data.city.country,
      sunrise, 
      sunset,
      forecast: daily,
    });
  } catch (error) {
    console.error("forecast error:", error.message);
    if (error.response?.status === 404)
      return res.status(404).json({ error: "City not found" });
    if (error.response?.status === 401)
      return res.status(500).json({ error: "Invalid API key" });
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

export default router;