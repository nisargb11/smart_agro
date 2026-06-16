import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Search, Play, Clock, User, X } from "lucide-react";  


const videoCategories = [
  "All",
  "Irrigation",
  "Pest Control", 
  "Soil Management",
  "Harvesting",
  "Technology"
];

const mockVideos = [
  {
    id: 1,
    title: "How to design an irrigation system",
    description: "An education video on designing a residential irrigation system.",
    category: "Irrigation",
    duration: "26:09",
    thumbnail: "/src/assets/irrigation_thumbnail.png",
    instructor: "David Brannan",
    videoUrl: "https://www.youtube.com/embed/DWV-pnt9EJw?si=CapiDrwsOEF7oeor"
  },
  {
    id: 2,
    title: "Pest Control",
    description: "Natural and effective ways to protect your crops from common pests",
    category: "Pest Control",
    duration: "35:48",
    thumbnail: "/src/assets/pest_thumbnail.png",
    instructor: "Vidya-mitra",
    videoUrl: "https://www.youtube.com/embed/KIEn1TSqrfk"
  },
  {
    id: 3,
    title: "Online Soil Testing and Analysis",
    description: "Complete guide to testing your soil quality and understanding the results online",
    category: "Soil Management",
    duration: "3:16",
    thumbnail: "/src/assets/solitest1_thumbnail.png",
    instructor: "Discover Agriculture",
    videoUrl: "https://www.youtube.com/embed/JYEqB9d3vDk"

  },
  {
    id: 4,
    title: "Soil Testing Laboratory Methods",
    description: "A detailed overview of laboratory techniques for accurate soil testing and analysis",
    category: "Soil Management",
    duration: "11:16",
    thumbnail: "/src/assets/soiltest2_thumbnail.png",
    instructor: "Discover Agriculture",
    videoUrl: "https://www.youtube.com/embed/JYEqB9d3vDk"

  },
  {
    id: 5,
    title: "Tomato Harvesting Techniques",
    description: "Best practices for harvesting tomatoes to ensure quality and maximize yield",
    category: "Harvesting",
    duration: "4:22",
    thumbnail: "/src/assets/harvest1_thumbnail.png",
    instructor: "INDUSTRY INSIDER",
    videoUrl: "https://www.youtube.com/embed/rsD2VJ65hEA"

  },
  {
    id: 6,
    title: "Growing corn from seed to harvest",
    description: "A comprehensive guide on cultivating corn, covering everything from planting to harvesting.",
    category: "Harvesting",
    duration: "22:09",
    thumbnail: "/src/assets/harvest2_thumbnail.png",
    instructor: "Epic Gardening",
    videoUrl: "https://www.youtube.com/embed/WNUNq4QJ-CM"

  },
  {
    id: 7,
    title: "Modern Agricultural Technologies",
    description: "Exploring the latest technological advancements transforming modern agriculture",
    category: "Technology",
    duration: "5:01",
    thumbnail: "/src/assets/tech1_thumbnail.png",
    instructor: "Discover Agriculture",
    videoUrl: "https://www.youtube.com/embed/Our-F5Fh3Go"

  },
  {
    id: 8,
    title: "Artificial Intelligence in Agriculture and future of smart farming with IOT",
    description: "A deep dive into how AI and IoT are revolutionizing farming practices for increased efficiency and sustainability",
    category: "Technology",
    duration: "6:53",
    thumbnail: "/src/assets/tech2_thumbnail.png",
    instructor: "Discover Agriculture",
    videoUrl: "https://www.youtube.com/embed/_tijHjup-gM"

  }
  
];

const Tutorials = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const filteredVideos = mockVideos.filter(video => {
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Video Tutorials</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn practical farming techniques from expert instructors through our comprehensive video library.
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {videoCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              onClick={() => setSelectedVideo(video.videoUrl)}
              className="group overflow-hidden border-primary/10 bg-gradient-card shadow-card hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                  {video.category}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{video.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{video.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No tutorials found matching your criteria</div>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {selectedVideo && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[90%] md:w-[60%] lg:w-[50%] relative">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
                aria-label="Close video"
                title="Close video"
              >
                <X className="h-5 w-5 text-gray-700" aria-hidden="true" />
              </button>
              <div className="aspect-video w-full rounded-t-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedVideo}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tutorials;
