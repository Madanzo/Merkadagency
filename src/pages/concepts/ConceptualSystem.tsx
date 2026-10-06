import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import sculpture from './assets/folded-glass-artwork.webp';
import './conceptual-system.css';

const labels = ['Website', 'CRM', 'AI assistance', 'Human review'];
const descriptions = [
  'A customer tells you what they need.',
  'The inquiry stays connected to the customer record.',
  'AI helps organize the details and prepare a draft.',
  'Your team reviews the draft and decides what happens next.',
];


export function ConceptualSystem() {
  const composition = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState({ width: 600, height: 570, paths: [] as string[] });
  useLayoutEffect(() => {
    const element = composition.current;
    if (!element) return;
    const measure = () => {
      const frame = element.getBoundingClientRect();
      const nodes = Array.from(element.querySelectorAll('button')).map(node => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left-frame.left, right: rect.right-frame.left, top: rect.top-frame.top, bottom: rect.bottom-frame.top, x: rect.left-frame.left+rect.width/2, y: rect.top-frame.top+rect.height/2 };
      });
      const [website, crm, ai, review] = nodes;
      const bend = (website.right + crm.left) / 2;
      const lowerBend = (ai.left + review.right) / 2;
      setGeometry({ width: frame.width, height: frame.height, paths: [
        `M${website.right} ${website.y}H${bend-12}L${bend+12} ${crm.y}H${crm.left}`,
        `M${crm.x} ${crm.bottom}V${(crm.bottom+ai.top)/2-12}L${ai.x} ${(crm.bottom+ai.top)/2+12}V${ai.top}`,
        `M${ai.left} ${ai.y}H${lowerBend+12}L${lowerBend-12} ${ai.y+24}V${review.y}H${review.right}`,
      ] });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll('button').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const elapsed = useRef(0);
  const [time, setTime] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => setReduced(preference.matches);
    const visibility = () => setTabVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .3), { threshold: [0, .3] });
    if (composition.current) observer.observe(composition.current);
    preference.addEventListener('change', changed);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); preference.removeEventListener('change', changed); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const playing = !paused && visible && tabVisible && !reduced && selected === null;
  useEffect(() => {
    if (!playing) return;
    let frame: number;
    let previous: number | null = null;
    const tick = (now: number) => {
      if (previous !== null) elapsed.current = (elapsed.current + now - previous) % 11000;
      previous = now;
      setTime(elapsed.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  // Three 2.4s journeys, 3s awaiting review, then an 0.8s soft reset.
  const step = reduced ? 3 : Math.min(3, Math.floor(time / 2400));
  const current = selected ?? step;
  const journey = time < 7200 ? Math.floor(time / 2400) : -1;
  const progress = (time % 2400) / 2400;
  const resetOpacity = time > 10200 ? (11000 - time) / 800 : 1;
  const charging = !reduced && time < 10200 && time - step * 2400 < 650 && step > 0;
  const reveal = (index: number) => setSelected(index);
  return <figure className="conceptual-system" aria-label="Conceptual system from website to CRM, AI assistance and human review">
    <figcaption>Conceptual system</figcaption>
    <div ref={composition} className="system-composition" data-step={step} data-selected={current} data-playing={playing} data-time={Math.round(time)} data-reduced={reduced}>
      <img className="system-artwork" src={sculpture} {...{ fetchpriority: "high" }} decoding="async" alt="" width="1254" height="1254" />
      <div className="coordinate-grid" aria-hidden="true" />
      <svg className="system-connections" viewBox={`0 0 ${geometry.width} ${geometry.height}`} aria-hidden="true">
        {geometry.paths.map((path,index)=><g key={path}>
          <path d={path} className="connection-base"/>
          <path d={path} className="connection-highlight" data-relevant={reduced || (selected !== null && (current===index || current===index+1))}/>
          {!reduced && journey===index && <path d={path} pathLength="100" className="connection-pulse" strokeDasharray="7 107" strokeDashoffset={7-progress*107}/>}
        </g>)}

      </svg>
      {labels.map((label,index)=><button type="button" key={label} className={`system-label system-label-${index}`} data-charging={selected===null && current===index && charging} style={{'--state-opacity': selected===null && !reduced ? resetOpacity : 1} as React.CSSProperties} data-state={current===index ? (index===3 ? 'review' : 'active') : 'idle'} aria-pressed={current===index} onPointerEnter={()=>reveal(index)} onPointerLeave={()=>setSelected(null)} onFocus={()=>reveal(index)} onBlur={()=>setSelected(null)} onClick={()=>reveal(index)}><span aria-hidden="true"/>{label}</button>)}
    </div>
    <div className="system-caption"><p aria-live="polite">{descriptions[selected ?? 3]}</p>{!reduced && <button type="button" onClick={()=>{setSelected(null);setPaused(value=>!value);}} aria-label={paused?'Play signal animation':'Pause signal animation'} aria-pressed={paused}>{paused?<Play aria-hidden="true"/>:<Pause aria-hidden="true"/>}<span>{paused?'Play':'Pause'}</span></button>}</div>
  </figure>;
}
