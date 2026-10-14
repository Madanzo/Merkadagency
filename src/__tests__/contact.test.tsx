import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEffect } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactPage } from '@/pages/ContactPage';
import { CONTACT_ATTEMPT_KEY } from '@/lib/contactIntake';
vi.mock('@/components/layout/Layout', () => ({ Layout: ({children}: {children: React.ReactNode}) => <>{children}</> }));
vi.mock('@/components/common/ContactVerification', () => ({ ContactVerification: ({onToken,onAvailability}: {onToken: (value: string)=>void;onAvailability:(value:boolean)=>void}) => { useEffect(()=>{onAvailability(true);onToken('local-test-token');},[onToken,onAvailability]); return <span>Local verification fixture</span>; } }));
const mockFetch = vi.fn();
const fill = () => {
  for(const [label,value] of Object.entries({Name:'Test Person', Email:'person@example.test', Subject:'Website', Message:'Please review our site.'})) fireEvent.change(screen.getByLabelText(label),{target:{value}});
};
const show = () => render(<MemoryRouter><ContactPage /></MemoryRouter>);
beforeEach(()=>{sessionStorage.clear();mockFetch.mockReset();vi.stubGlobal('fetch',mockFetch);});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
describe('contact persistence boundary',()=>{
  it('uses the same strict receipt boundary for audit requests',async()=>{
    mockFetch.mockResolvedValue({ok:true,json:async()=>({})});
    render(<MemoryRouter><ContactPage requestType="audit"/></MemoryRouter>);fill();
    fireEvent.click(screen.getByRole('button',{name:'Send Message'}));
    await screen.findByRole('alert');
    expect(screen.queryByText('Message received')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toHaveValue('Please review our site.');
  });
  it('keeps details on network failure and replays exact request after remount',async()=>{
    mockFetch.mockRejectedValueOnce(new Error('offline'));
    const view=show();fill();
    fireEvent.click(screen.getByRole('button',{name:'Send Message'}));
    await screen.findByRole('alert');
    expect(screen.getByLabelText('Message')).toHaveValue('Please review our site.');
    expect(screen.queryByText('Message received')).not.toBeInTheDocument();
    const first=mockFetch.mock.calls[0][1];
    view.unmount();show();
    mockFetch.mockImplementationOnce(async(_url,init)=>({ok:true,json:async()=>({code:'persisted',submissionId:init.headers['Idempotency-Key']})}));
    fireEvent.click(screen.getByRole('button',{name:'Retry Message'}));
    await screen.findByText('Message received');
    expect(mockFetch.mock.calls[1][1].body).toBe(first.body);
    expect(mockFetch.mock.calls[1][1].headers).toEqual(first.headers);
    expect(sessionStorage.getItem(CONTACT_ATTEMPT_KEY)).toBeNull();
  });
  it('guards concurrent submissions and waits for receipt',async()=>{
    let finish: (value: unknown)=>void = ()=>{};
    mockFetch.mockReturnValue(new Promise(resolve=>{finish=resolve;}));
    show();fill();const form=screen.getByRole('button',{name:'Send Message'}).closest('form')!;
    fireEvent.submit(form);fireEvent.submit(form);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Message received')).not.toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Saving...'})).toBeDisabled();
    const key=mockFetch.mock.calls[0][1].headers['Idempotency-Key'];
    await act(async()=>finish({ok:true,json:async()=>({code:'persisted',submissionId:key})}));
    expect(screen.getByText('Message received')).toBeInTheDocument();
  });
  it.each([{}, {code:'persisted',submissionId:'wrong'}, {code:'created'}])('rejects malformed or mismatched receipt %j',async body=>{
    mockFetch.mockResolvedValue({ok:true,json:async()=>body});show();fill();
    fireEvent.click(screen.getByRole('button',{name:'Send Message'}));
    await screen.findByRole('alert');expect(screen.queryByText('Message received')).not.toBeInTheDocument();
  });
  it('rejects SPA HTML fallback and keeps form fields',async()=>{
    mockFetch.mockResolvedValue({ok:true,json:async()=>{throw new SyntaxError('HTML');}});show();fill();
    fireEvent.click(screen.getByRole('button',{name:'Send Message'}));
    await screen.findByRole('alert');expect(screen.getByLabelText('Name')).toHaveValue('Test Person');
  });
  it('does not send if retry state cannot be safely saved',async()=>{
    vi.spyOn(Storage.prototype,'setItem').mockImplementationOnce(()=>{throw new Error('blocked');});show();fill();
    fireEvent.click(screen.getByRole('button',{name:'Send Message'}));await screen.findByRole('alert');expect(mockFetch).not.toHaveBeenCalled();vi.restoreAllMocks();
  });
  it('discards saved draft only after confirmation without cancelling CRM state',async()=>{
    mockFetch.mockRejectedValue(new Error('offline'));show();fill();
    fireEvent.click(screen.getByRole('button',{name:'Send Message'}));await screen.findByRole('alert');
    fireEvent.click(screen.getByRole('button',{name:'Discard draft'}));
    expect(sessionStorage.getItem(CONTACT_ATTEMPT_KEY)).not.toBeNull();
    fireEvent.click(screen.getByRole('button',{name:'Discard saved draft'}));
    expect(sessionStorage.getItem(CONTACT_ATTEMPT_KEY)).toBeNull();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
  it('omits unverified phone/location and response-time promise',()=>{
    show();expect(screen.queryByText(/434-3793|Austin|24 hours/)).not.toBeInTheDocument();
  });
});
it('freezes optional context after ambiguous delivery and focuses the error', async()=>{
  mockFetch.mockRejectedValue(new Error('offline'));show();fill();
  fireEvent.change(screen.getByLabelText('Company'),{target:{value:'Synthetic Studio'}});
  fireEvent.change(screen.getByLabelText('Current tools'),{target:{value:'Email and spreadsheets'}});
  fireEvent.change(screen.getByLabelText('When would you like to start?'),{target:{value:'1–3 months'}});
  fireEvent.click(screen.getByRole('button',{name:'Send Message'}));
  const error=await screen.findByRole('alert');
  expect(error).toHaveFocus();
  expect(screen.getByLabelText('Company')).toBeDisabled();
  expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toMatchObject({companyName:'Synthetic Studio',currentStack:'Email and spreadsheets',desiredTimeline:'1–3 months'});
});
