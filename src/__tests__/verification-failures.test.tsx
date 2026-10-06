import { afterEach, expect, it, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactPage } from '@/pages/ContactPage';
vi.mock('@/components/layout/Layout',()=>({Layout:({children}:{children:React.ReactNode})=><main>{children}</main>}));
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.unstubAllEnvs();delete window.turnstile;});
it.each([false,null,{}, {enabled:true,siteKey:''}])('hides inputs for disabled or malformed configuration %j',async config=>{
  vi.stubEnv('VITE_CONTACT_INTAKE_ENABLED','true');const send=vi.fn().mockResolvedValue({ok:true,json:async()=>config});vi.stubGlobal('fetch',send);
  render(<MemoryRouter><ContactPage/></MemoryRouter>);
  await screen.findByText(/Online (requests are currently disabled|intake is unavailable)/);
  expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();expect(screen.queryByText('Message received')).not.toBeInTheDocument();
  expect(send.mock.calls).toHaveLength(1);
});
it('hides inputs after verification error without submitting an inquiry',async()=>{
  vi.stubEnv('VITE_CONTACT_INTAKE_ENABLED','true');let options:Record<string,unknown>={};
  window.turnstile={render:vi.fn((_el,opts)=>{options=opts;return 'synthetic-widget';}),remove:vi.fn()};
  const send=vi.fn().mockResolvedValue({ok:true,json:async()=>({enabled:true,siteKey:'synthetic'})});vi.stubGlobal('fetch',send);
  render(<MemoryRouter><ContactPage/></MemoryRouter>);await screen.findByLabelText('Name');
  await act(async()=>{(options['error-callback'] as ()=>void)();});
  expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();expect(screen.queryByText('Message received')).not.toBeInTheDocument();
  expect(send.mock.calls).toHaveLength(1);
});
it('denies inputs and does not load Turnstile when the release gate is off',async()=>{
  vi.stubEnv('VITE_CONTACT_INTAKE_ENABLED','false');const send=vi.fn();vi.stubGlobal('fetch',send);
  render(<MemoryRouter><ContactPage/></MemoryRouter>);await screen.findByText(/Online requests are currently disabled/);
  expect(send).not.toHaveBeenCalled();expect(document.querySelector('script[src*="turnstile"]')).toBeNull();
});
