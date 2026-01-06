import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServicesHub from "./pages/services/ServicesHub";
import AILeadCapture from "./pages/services/AILeadCapture";
import { CRMAutomation } from "./pages/services/CRMAutomation";
import { SEOContent } from "./pages/services/SEOContent";
import { PaidAdvertising } from "./pages/services/PaidAdvertising";
import ResultsPage from "./pages/ResultsPage";
import PortfolioPage from "./pages/PortfolioPage";
import CaseStudiesHub from "./pages/case-studies/CaseStudiesHub";
import KravingsCaseStudy from "./pages/case-studies/KravingsCaseStudy";
import TeonanacatlCaseStudy from "./pages/case-studies/TeonanacatlCaseStudy";
import GridNGuardCaseStudy from "./pages/case-studies/GridNGuardCaseStudy";
import BookPage from "./pages/BookPage";
import AboutPage from "./pages/about/AboutPage";
import MethodPage from "./pages/about/MethodPage";
import { FreeAudit } from "./pages/resources/FreeAudit";
import { ROICalculator } from "./pages/resources/ROICalculator";
import MedspaChecklist from "./pages/resources/MedspaChecklist";
import CannabisPlaybook from "./pages/resources/CannabisPlaybook";
import ContractorGuide from "./pages/resources/ContractorGuide";
import { ContactPage } from "./pages/ContactPage";
import { BlogPage } from "./pages/blog/BlogPage";
import { PrivacyPage } from "./pages/legal/PrivacyPage";
import { TermsPage } from "./pages/legal/TermsPage";
import FirebaseTest from "./pages/FirebaseTest";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

import IndustriesHub from "./pages/industries/IndustriesHub";
import MedspasPage from "./pages/industries/MedspasPage";
import CannabisPage from "./pages/industries/CannabisPage";
import ConstructionPage from "./pages/industries/ConstructionPage";
import EcommercePage from "./pages/industries/EcommercePage";
import EcommerceGuide from "./pages/resources/EcommerceGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Services */}
          <Route path="/services" element={<ServicesHub />} />
          <Route path="/services/ai-lead-capture" element={<AILeadCapture />} />
          <Route path="/services/crm-automation" element={<CRMAutomation />} />
          <Route path="/services/seo-content" element={<SEOContent />} />
          <Route path="/services/paid-advertising" element={<PaidAdvertising />} />
          {/* Industries */}
          <Route path="/industries" element={<IndustriesHub />} />
          <Route path="/industries/medspas" element={<MedspasPage />} />
          <Route path="/industries/cannabis" element={<CannabisPage />} />
          <Route path="/industries/construction" element={<ConstructionPage />} />
          <Route path="/industries/ecommerce" element={<EcommercePage />} />
          {/* Case Studies */}
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />

          <Route path="/case-studies" element={<CaseStudiesHub />} />
          <Route path="/case-studies/kravings" element={<KravingsCaseStudy />} />
          <Route path="/case-studies/teonanacatl" element={<TeonanacatlCaseStudy />} />
          <Route path="/case-studies/gridnguard" element={<GridNGuardCaseStudy />} />
          {/* Resources */}
          <Route path="/resources/free-audit" element={<FreeAudit />} />
          <Route path="/resources/roi-calculator" element={<ROICalculator />} />
          <Route path="/resources/medspa-automation-checklist" element={<MedspaChecklist />} />
          <Route path="/resources/cannabis-marketing-playbook" element={<CannabisPlaybook />} />
          <Route path="/resources/contractor-lead-gen-guide" element={<ContractorGuide />} />
          <Route path="/resources/ecommerce-automation-blueprint" element={<EcommerceGuide />} />
          {/* About */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/method" element={<MethodPage />} />
          {/* Other */}
          <Route path="/book" element={<BookPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Legal */}
          <Route path="/legal/privacy" element={<PrivacyPage />} />
          <Route path="/legal/terms" element={<TermsPage />} />
          {/* Firebase Test (temporary) */}
          <Route path="/firebase-test" element={<FirebaseTest />} />
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
