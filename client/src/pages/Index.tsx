import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import FeatureCard from "@/components/FeatureCard";
import { Video, Map, Cloud, Leaf, Users, TrendingUp, Shield, Microscope } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

const Index = () => {
  const features = [
    {
      title: "Video Tutorials",
      description: "Access comprehensive farming knowledge through expert-led video tutorials covering irrigation, pest control, and crop management.",
      icon: Video,
      href: "/tutorials",
      buttonText: "Watch Tutorials",
      gradient: "bg-gradient-to-br from-primary/10 to-primary/5"
    },
    {
      title: "Crop Recommendation", 
      description: "Follow step-by-step seasonal guides for growing specific crops with detailed timelines and actionable tasks.",
      icon: Map,
      href: "/recommend",
      buttonText: "View Roadmaps",
      gradient: "bg-gradient-to-br from-accent/10 to-accent/5"
    },
    {
      title: "Disease Detection",
      description: "The plant disease detection feature in SmartAgro is an end-to-end pipeline that goes from a leaf photo to a structured diagnosis.",
      icon: Microscope,
      href: "/disease", 
      buttonText: "Detect Disease",
      gradient: "bg-gradient-to-br from-weather/10 to-weather/5"
    }
  ];

  const stats = [
    { label: "Active Farmers", value: "10,000+", icon: Users },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "Expert Verified", value: "100%", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Header />
      
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Modern farming landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Smart Farming
              <span className="block text-primary-light">Made Simple</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Empower your farming journey with expert guidance, seasonal roadmaps, and real-time weather insights. 
              Join thousands of farmers achieving better yields through smart agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                <Leaf className="mr-2 h-5 w-5" />
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and guidance to help you make informed decisions and maximize your agricultural success
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-4xl mx-auto border-primary/10 bg-gradient-card shadow-card">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Farming?
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Join our community of successful farmers and start your journey towards smarter, more profitable agriculture today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                  Start Your Free Trial
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Contact Sales
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • 30-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
