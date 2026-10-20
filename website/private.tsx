// Separate entry keeps legacy public marketing, forms and analytics out of this artifact.
// Existing authentication, dashboard and signing implementations are unchanged.
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ContractSigningPage from '@/pages/sign/ContractSigningPage';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <ErrorBoundary><HelmetProvider><QueryClientProvider client={queryClient}><TooltipProvider>
    <Toaster /><Sonner /><BrowserRouter><Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/sign/:contractId" element={<ContractSigningPage />} />
      <Route path="*" element={<a href="/">Return to MerkadAgency</a>} />
    </Routes></BrowserRouter>
  </TooltipProvider></QueryClientProvider></HelmetProvider></ErrorBoundary>
);
