import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import SpamClassification from "./pages/projects/SpamClassification";
import SentimentAnalysis from "./pages/projects/SentimentAnalysis";
import LoanApproval from "./pages/projects/LoanApproval";
import ButterflyClassification from "./pages/projects/ButterflyClassification";
import GalaxyRegression from "./pages/projects/GalaxyRegression";
import FishClustering from "./pages/projects/FishClustering";
import GDPAnalysis from "./pages/projects/GDPAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/spam-classification" element={<SpamClassification />} />
          <Route path="/projects/sentiment-analysis" element={<SentimentAnalysis />} />
          <Route path="/projects/loan-approval" element={<LoanApproval />} />
          <Route path="/projects/butterfly-classification" element={<ButterflyClassification />} />
          <Route path="/projects/galaxy-regression" element={<GalaxyRegression />} />
          <Route path="/projects/fish-clustering" element={<FishClustering />} />
          <Route path="/projects/gdp-analysis" element={<GDPAnalysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;