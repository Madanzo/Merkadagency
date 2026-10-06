import './lib/inquiryAttribution';
import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouteMetadata } from './components/layout/RouteMetadata';
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute').then(m=>({default:m.ProtectedRoute})));
import { detailPages } from './pages/public/siteContent';
const Index = lazy(() => import('./pages/Index'));
const ArtConcepts = import.meta.env.DEV ? lazy(() => import('./pages/concepts/ArtConcepts')) : null;
const PublicDetail = lazy(() => import('./pages/public/PublicPages').then(m=>({default:m.PublicDetail})));
const PublicHub = lazy(() => import('./pages/public/PublicPages').then(m=>({default:m.PublicHub})));
const EvidencePage = lazy(() => import('./pages/public/PublicPages').then(m=>({default:m.EvidencePage})));
const NotFound = lazy(() => import('./pages/NotFound'));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m=>({default:m.ContactPage})));
const ROICalculator = lazy(() => import('./pages/resources/ROICalculator').then(m=>({default:m.ROICalculator})));
const BlogPage = lazy(() => import('./pages/blog/BlogPage').then(m=>({default:m.BlogPage})));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage').then(m=>({default:m.PrivacyPage})));
const TermsPage = lazy(() => import('./pages/legal/TermsPage').then(m=>({default:m.TermsPage})));
const BookPage = lazy(() => import('./pages/BookPage'));
const MedspaChecklist = lazy(() => import('./pages/resources/MedspaChecklist'));
const CannabisPlaybook = lazy(() => import('./pages/resources/CannabisPlaybook'));
const ContractorGuide = lazy(() => import('./pages/resources/ContractorGuide'));
const EcommerceGuide = lazy(() => import('./pages/resources/EcommerceGuide'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ContractSigningPage = lazy(() => import('./pages/sign/ContractSigningPage'));

const queryClient = new QueryClient();

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const App = () => {
  useScrollAnimation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteMetadata />
          <Suspense fallback={<div role="status" className="route-loading">Loading page…</div>}>
          <Routes>
            {ArtConcepts && <Route path="/review/art-direction/:concept" element={<ArtConcepts/>}/>}
            <Route path="/" element={<Index/>}/>
            {Object.keys(detailPages).map(path=><Route key={path} path={path} element={<PublicDetail/>}/>)}
            {['/services','/industries'].map(path=><Route key={path} path={path} element={<PublicHub/>}/>)}
            {['/results','/portfolio','/case-studies','/case-studies/kravings','/case-studies/teonanacatl','/case-studies/gridnguard'].map(path=><Route key={path} path={path} element={<EvidencePage/>}/>)}
            <Route path="/contact" element={<ContactPage/>}/>
            <Route path="/resources/free-audit" element={<ContactPage requestType="audit"/>}/>
            <Route path="/resources/roi-calculator" element={<ROICalculator/>}/>
            <Route path="/resources/medspa-automation-checklist" element={<MedspaChecklist/>}/>
            <Route path="/resources/cannabis-marketing-playbook" element={<CannabisPlaybook/>}/>
            <Route path="/resources/contractor-lead-gen-guide" element={<ContractorGuide/>}/>
            <Route path="/resources/ecommerce-automation-blueprint" element={<EcommerceGuide/>}/>
            <Route path="/book" element={<BookPage/>}/>
            <Route path="/blog" element={<BlogPage/>}/>
            <Route path="/blog/:slug" element={<BlogPage/>}/>
            <Route path="/legal/privacy" element={<PrivacyPage/>}/>
            <Route path="/legal/terms" element={<TermsPage/>}/>
            <Route path="/admin/login" element={<AdminLogin/>}/>
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
            <Route path="/sign/:contractId" element={<ContractSigningPage/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

};

export default App;
