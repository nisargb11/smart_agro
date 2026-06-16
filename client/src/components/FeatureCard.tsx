import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient?: string;
}

const FeatureCard = ({ title, description, icon: Icon, href, gradient }: FeatureCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-primary/10 bg-gradient-card shadow-card transition-all duration-300 hover:shadow-xl hover:scale-105">
      <CardHeader className="relative">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${gradient || 'bg-primary/10'}`}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={href}>
          <Button className="w-full group-hover:shadow-lg transition-all duration-300">
            Learn More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;