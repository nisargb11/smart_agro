import { Button } from "@/components/ui/button";
import { Leaf, Menu, Video, Map, Cloud, Microscope } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import i18n from "i18next";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [langOpen,setLangOpen]=useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/index", icon: Leaf },
    { name: "Video Tutorials", href: "/tutorials", icon: Video },
    { name: "Crop Recommendation", href: "/recommend", icon: Map },
    //{ name: "Weather", href: "/weather", icon: Cloud },
    { name: "Disease Detection", href: "/disease", icon:Microscope},
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-light">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SmartAgro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="relative hidden md:flex items-center ml-4">
  <Button
    size="sm"
    variant="outline"
    onClick={() => setLangOpen(!langOpen)}
  >
    🌍 Language
  </Button>

  {langOpen && (
    <div className="absolute right-0 top-10 w-32 bg-white border rounded-md shadow-lg z-50">
      <button
        className="w-full text-left px-3 py-2 hover:bg-gray-100"
        onClick={() => {
          i18n.changeLanguage("en");
          setLangOpen(false);
        }}
      >
        English
      </button>
      <button
        className="w-full text-left px-3 py-2 hover:bg-gray-100"
        onClick={() => {
          i18n.changeLanguage("hi");
          setLangOpen(false);
        }}
      >
        हिन्दी
      </button>
      <button
        className="w-full text-left px-3 py-2 hover:bg-gray-100"
        onClick={() => {
          i18n.changeLanguage("mr");
          setLangOpen(false);
        }}
      >
        मराठी
      </button>
    </div>
  )}
</div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="flex flex-col space-y-1 py-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;