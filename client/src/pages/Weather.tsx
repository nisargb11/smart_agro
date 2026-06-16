import { useState, useEffect ,useCallback} from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { 
  Cloud, CloudRain, Sun, CloudSnow, MapPin, Droplets, Wind, Eye, Calendar, Sunrise, Sunset 
} from "lucide-react";

const BASE = "http://localhost:3000/weather";

const farmingRecommendations = [
  { title: "Irrigation Planning", description: "Adjust irrigation depending on rainfall forecast.", priority: "medium", icon: Droplets },
  { title: "Pest Control", description: "High humidity may increase pest risk. Monitor crops.", priority: "high", icon: Eye },
  { title: "Harvesting", description: "Plan harvest on dry sunny days for best yield.", priority: "low", icon: Calendar }
];

const Weather = () => {
  const [city, setCity] = useState(""); 
  const [location, setLocation] = useState(""); 
  const [forecast, setForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getIcon = (condition: string) => {
    if (condition.includes("Rain")) return CloudRain;
    if (condition.includes("Cloud")) return Cloud;
    if (condition.includes("Sun") || condition.includes("Clear")) return Sun;
    if (condition.includes("Snow")) return CloudSnow;
    return Cloud;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const fetchWeather = useCallback(async (cityName: string) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/forecast?city=${encodeURIComponent(cityName)}`);
      const data = res.data;
      const today = data.forecast[0];
  
      setCurrentWeather({
        location: `${data.city}, ${data.country}`,
        temperature: Math.round(today.temp),
        condition: today.description,
        humidity: today.humidity,
        windSpeed: today.windSpeed,
        sunrise: data.sunrise,
        sunset: data.sunset,
        icon: getIcon(today.condition),
      });
  
      setForecast(data.forecast.map((item: any) => ({
        date: new Date(item.date + "T00:00:00").toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric",
        }),
        high: Math.round(item.temp),
        low: Math.round(item.temp_min),       
        condition: item.condition,
        description: item.description,
        precipitation: item.pop,             
        icon: getIcon(item.condition),
      })));
  
      setLocation(`${data.city}, ${data.country}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }, []); 
  
  useEffect(() => {
    const fetchCityFromDB = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(`${BASE}/user-city?userId=${userId}`);
        const cityFromDB = res.data.city;
        setCity(cityFromDB);
        fetchWeather(cityFromDB);
      } catch (err) {
        console.error("Failed to fetch city from DB:", err);
      }
    };
    fetchCityFromDB();
  }, [fetchWeather]);

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Weather Forecast</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get real-time weather data and farming recommendations for your location
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => fetchWeather(city)} disabled={loading}>
              {loading ? "Loading..." : "Get Forecast"}
            </Button>
          </div>
        </div>

        {currentWeather && (
          <Card className="mb-8 border-primary/10 bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-foreground flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{currentWeather.location}</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Current weather conditions
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">{currentWeather.temperature}°C</div>
                  <div className="text-muted-foreground capitalize">{currentWeather.condition}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-weather" />
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="font-medium">{currentWeather.humidity}%</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-weather" />
                  <div>
                    <div className="text-sm text-muted-foreground">Wind</div>
                    <div className="font-medium">{currentWeather.windSpeed} km/h</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sunrise className="h-4 w-4 text-weather" />
                  <div>
                    <div className="text-sm text-muted-foreground">Sunrise</div>
                    <div className="font-medium">{currentWeather.sunrise}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sunset className="h-4 w-4 text-weather" />
                  <div>
                    <div className="text-sm text-muted-foreground">Sunset</div>
                    <div className="font-medium">{currentWeather.sunset}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">5-Day Forecast</h2>
            <div className="space-y-4">
              {forecast.map((day, idx) => {
                const Icon = day.icon;
                return (
                  <Card key={idx} className="border-primary/10 bg-gradient-card shadow-card hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Icon className="h-8 w-8 text-weather" />
                          <div>
                            <div className="font-medium text-foreground">{day.date}</div>
                            <div className="text-sm text-muted-foreground">{day.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Condition</div>
                            <div className="font-medium">{day.condition}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Rain</div>
                            <div className="font-medium text-weather">{day.precipitation}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">High/Low</div>
                            <div className="font-medium">
                              <span className="text-primary">{day.high}°</span>
                              <span className="text-muted-foreground mx-1">/</span>
                              <span className="text-muted-foreground">{day.low}°</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Farming Recommendations</h2>
            <div className="space-y-4">
              {farmingRecommendations.map((rec, idx) => {
                const Icon = rec.icon;
                return (
                  <Card key={idx} className="border-primary/10 bg-gradient-card shadow-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-sm font-medium">{rec.title}</CardTitle>
                            <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <CardDescription className="text-xl text-muted-foreground">
                            {rec.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Weather;
