import { useEffect, useRef, useState } from 'react';

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile; } }
let scriptReady: Promise<void> | undefined;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptReady) scriptReady = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    const timer = window.setTimeout(() => { scriptReady = undefined; script.remove(); reject(new Error('Verification timed out')); }, 10000);
    script.onload = () => { clearTimeout(timer); resolve(); };
    script.onerror = () => { clearTimeout(timer); scriptReady = undefined; script.remove(); reject(new Error('Verification unavailable')); };
    document.head.append(script);
  });
  return scriptReady;
}
export function ContactVerification({ attemptNumber, onToken, onAvailability }: { attemptNumber: number; onToken: (token: string) => void; onAvailability: (enabled: boolean) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Checking inquiry availability…');
  useEffect(() => {
    let cancelled = false;
    let widget: string | undefined;
    let verificationFailed = false;
    onToken('');
    onAvailability(false);
    if (import.meta.env.VITE_CONTACT_INTAKE_ENABLED !== 'true') {
      setStatus('Online requests are currently disabled. Use the contact options on this page; no inquiry can be submitted here.');
      return;
    }
    (async () => {
      try {
        const response = await fetch('/api/contact-intake/config', { signal: AbortSignal.timeout(8000), cache: 'no-store', redirect: 'error' });
        const config = await response.json();
        if (cancelled) return;
        if (!response.ok || !config || config.enabled !== true || typeof config.siteKey !== 'string' || !config.siteKey.trim()) {
          setStatus('Online requests are currently disabled. Use the contact options on this page; no inquiry can be submitted here.'); return;
        }
        await loadScript();
        if (cancelled) return;
        if (!container.current || !window.turnstile) throw new Error('Verification unavailable');
        setStatus('Complete verification before sending your inquiry.');
        widget = window.turnstile.render(container.current, {
          sitekey: config.siteKey, action: 'contact_intake', theme: 'dark',
          callback: (token: string) => { if (!cancelled) onToken(token); },
          'expired-callback': () => { if (!cancelled) { onToken(''); setStatus('Verification expired. Complete verification again before sending.'); } },
          'error-callback': () => { if (!cancelled) { verificationFailed = true; onToken(''); onAvailability(false); setStatus('Verification failed. Reload to try again, or use the contact options on this page.'); } },
        });
        onAvailability(!verificationFailed);
      } catch { if (!cancelled) { onToken(''); onAvailability(false); setStatus('Online intake is unavailable. No new request was sent. Use the contact options on this page.'); } }
    })();
    return () => { cancelled = true; if (widget) window.turnstile?.remove(widget); };
  }, [attemptNumber, onToken, onAvailability]);
  return <div><p className="text-sm text-merkad-text-secondary" role="status">{status}</p><div ref={container} /></div>;
}
