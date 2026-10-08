import { useEffect, useId, useRef, useState } from 'react';
import { MessageSquare, Pause, Play, UserRound, ListFilter } from 'lucide-react';
import './angular-inquiry.css';
import './inquiry-workspace.css';

/** Scripted illustration. No requests, model calls or sending actions. */
export function AngularInquiry() {
  const workspace = useRef<HTMLElement>(null);
  const elapsed = useRef(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => setReduced(preference.matches);
    const visibilityChanged = () => setTabVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .25), { threshold: [0, .25] });
    if (workspace.current) observer.observe(workspace.current);
    preference.addEventListener('change', motionChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => { observer.disconnect(); preference.removeEventListener('change', motionChanged); document.removeEventListener('visibilitychange', visibilityChanged); };
  }, []);
  const playing = !paused && !focused && visible && tabVisible && !reduced;
  useEffect(() => {
    if (!playing) return;
    let frame: number;
    let previous: number | null = null;
    const tick = (now: number) => {
      if (previous !== null) elapsed.current = (elapsed.current + now - previous) % 16000;
      previous = now;
      setTime(elapsed.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const active = time < 4000 ? 0 : time < 9000 ? 1 : 2;
  const progress = active === 0 ? time / 4000 : active === 1 ? (time - 4000) / 5000 : (time - 9000) / 7000;
  const select = (index: number) => { setPaused(true); elapsed.current = [0, 4000, 9000][index]; setTime(elapsed.current); };
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const selectWithKeyboard = (key: string, index: number) => {
    const next = key === 'Home' ? 0 : key === 'End' ? 2 : key === 'ArrowRight' ? (index + 1) % 3 : key === 'ArrowLeft' ? (index + 2) % 3 : null;
    if (next === null) return false;
    select(next);
    buttons.current[next]?.focus();
    return true;
  };
  return <figure ref={workspace} className="inquiry-workspace" aria-label="Scripted inquiry example" data-active={active} data-time={Math.round(time)} data-playing={playing} onFocusCapture={event => { if (event.target.matches(':focus-visible')) setFocused(true); }} onKeyDownCapture={() => setFocused(true)} onPointerDownCapture={() => setFocused(false)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <figcaption>Illustrative example</figcaption>
    <div className="workspace-toolbar">
      <div className="workspace-stages" role="group" aria-label="Explore the example">
        {['Inquiry', 'Organize', 'Review'].map((name, index) => <button key={name} ref={node => { buttons.current[index] = node; }} type="button" aria-pressed={active === index} aria-controls={`${id}-${index}`} onClick={() => select(index)} onKeyDown={event => { if (selectWithKeyboard(event.key, index)) event.preventDefault(); }}><span>0{index + 1}</span>{name}<i className="workspace-progress" aria-hidden="true" style={{ transform: `scaleX(${active === index && !reduced ? progress : 0})` }}/></button>)}
      </div>
      {!reduced && <button className="workspace-playback" type="button" aria-label={paused ? 'Play illustrative example' : 'Pause illustrative example'} title={paused ? 'Play example' : 'Pause example'} aria-describedby={`${id}-playback-help`} onClick={() => setPaused(value => !value)}>{paused ? <Play aria-hidden="true"/> : <Pause aria-hidden="true"/>}</button>}
      <span id={`${id}-playback-help`} className="sr-only">Playback pauses while keyboard focus is inside this example. Move focus outside to resume.</span>
    </div>
    <div className="workspace-content">
      <section id={`${id}-0`} className="workspace-section" data-selected={active === 0} aria-label="Original inquiry">
        <h3><MessageSquare aria-hidden="true"/>Inquiry</h3>
        <blockquote>“We need a new website. Our inquiries arrive through email and Instagram, and we keep losing track.”</blockquote>
      </section>
      <section id={`${id}-1`} className="workspace-section" data-selected={active === 1} aria-label="Organized details">
        <h3><ListFilter aria-hidden="true"/>Organized details</h3>
        <dl>
          <div><dt>Project</dt><dd>New website</dd></div>
          <div><dt>Inquiry channels</dt><dd>Email + Instagram</dd></div>
          <div><dt>Reported problem</dt><dd>Losing track of inquiries</dd></div>
          <div><dt>Still to clarify</dt><dd>Current CRM and follow-up owner</dd></div>
        </dl>
      </section>
      <section id={`${id}-2`} className="workspace-section" data-selected={active === 2} aria-label="Suggested reply">
        <h3><UserRound aria-hidden="true"/>Suggested reply</h3>
        <p>“Which tool do you currently use to track inquiries, and who handles follow-up? That will help us understand how the website should connect to your process.”</p>
      </section>
    </div>
    <p className="workspace-status" data-selected={active === 2}><span aria-hidden="true"/>Awaiting your review.</p>
  </figure>;
}
