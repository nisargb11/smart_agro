import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tutorials from "./pages/Tutorials";
import CropRecommendation from "./pages/CropRecommendation";
import Weather from "./pages/Weather";
import DiseaseDetection from "./pages/DiseaseDetection.jsx";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Enquiry from "./pages/Enquiry.jsx";
import "./i18n.js";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/su" element={<SignUp />} />
          <Route path="/lo" element={<Login />} />
          <Route path="/index" element={<Index/>}/>
          <Route path="/en" element={<Enquiry />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/recommend" element={<CropRecommendation />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  
);

export default App;
