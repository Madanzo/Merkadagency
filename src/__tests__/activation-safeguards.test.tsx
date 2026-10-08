import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createAnalyticsGate, type AnalyticsConfig } from '@/lib/analyticsGate';
import { ContactPage } from '@/pages/ContactPage';
import { TermsPage } from '@/pages/legal/TermsPage';
import { readFileSync } from 'node:fs';
vi.mock('@/components/layout/Layout',()=>({Layout:({children}:{children:React.ReactNode})=><main>{children}</main>}));
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
const config: AnalyticsConfig={production:true,enabled:'true',approval:'test-approval',approvedHost:'example.test',hostname:'example.test',gaId:'G-TEST123',clarityId:'test123'};
describe('optional measurement fail-closed gate',()=>{
 it('does not load providers without every approval/configuration condition, even with consent',()=>{
  for(const change of [{enabled:undefined},{enabled:'false'},{approval:''},{production:false},{hostname:'preview.example.test'},{hostname:'localhost',approvedHost:'localhost'},{gaId:''},{clarityId:''}]){
   const ga=vi.fn(),clarity=vi.fn();createAnalyticsGate({...config,...change},{ga,clarity})({ga:true,clarity:true});expect(ga).not.toHaveBeenCalled();expect(clarity).not.toHaveBeenCalled();
  }
 });
 it('requires provider-specific affirmative consent and starts each loader only once',()=>{
  const ga=vi.fn(),clarity=vi.fn();const apply=createAnalyticsGate(config,{ga,clarity});
  apply({ga:false,clarity:false});expect(ga).not.toHaveBeenCalled();expect(clarity).not.toHaveBeenCalled();
  apply({ga:true,clarity:false});expect(ga).toHaveBeenCalledTimes(1);expect(clarity).not.toHaveBeenCalled();
  apply({ga:true,clarity:true});apply({ga:true,clarity:true});expect(ga).toHaveBeenCalledTimes(1);expect(clarity).toHaveBeenCalledTimes(1);
 });
 it('has no boot-time GA/Clarity or legacy Firebase analytics activation',()=>{
  expect(readFileSync('index.html','utf8')).not.toContain('googletagmanager.com/gtag');
  expect(readFileSync('src/main.tsx','utf8')).not.toContain('Clarity.init');
  expect(readFileSync('src/lib/firebase.ts','utf8')).not.toContain('getAnalytics');
 });
});
describe('publishable promises and unavailable intake',()=>{
 it.each(['contact','audit'] as const)('shows unavailable %s intake before fields and makes no POST',async requestType=>{
  const fetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({enabled:false})});vi.stubGlobal('fetch',fetch);
  render(<MemoryRouter><ContactPage requestType={requestType}/></MemoryRouter>);
  const status=await screen.findByText(/Online requests are currently disabled/);
  expect(screen.queryByRole('button',{name:'Send Message'})).not.toBeInTheDocument();
  expect(status).toBeVisible();
  expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
  expect(screen.queryByText('Message received')).not.toBeInTheDocument();
  expect(screen.getByRole('link',{name:'camiloreyna@merkadagency.com'})).toHaveAttribute('href','mailto:camiloreyna@merkadagency.com');
  expect(fetch.mock.calls.every(([url])=>url==='/api/contact-intake/config')).toBe(true);
 });
 it('removes the unsupported guarantee from mounted terms',()=>{
  render(<TermsPage/>);expect(screen.queryByText(/90.Day|Growth Guarantee/i)).not.toBeInTheDocument();
 });
});
