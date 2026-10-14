import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import './art-concepts.css';
import { AngularInquiry } from './AngularInquiry';
import { ServiceGraphic } from './ServiceGraphic';
import { ConceptualSystem } from './ConceptualSystem';
import workPreview from '../../../docs/website-review/previews/desktop-viewport.png';

// Owner approved only MerkadAgency's own work for this comparison.
const approvedWork = {src:workPreview,name:'MerkadAgency',description:'Existing website study · Original local capture'};
export default function ArtConcepts(){
 const studio=location.pathname.endsWith('/b');
 const review = new URLSearchParams(location.search).has('review');
 return <div className={`art-concept ${studio?'art-studio':'art-precision'} ${review?'art-review':'art-customer'}`}><Header/><main>
 {review && <nav className="concept-switch" aria-label="Compare art directions"><Link to="/review/art-direction/a?review=1" aria-current={!studio?'page':undefined}>A / Precision</Link><Link to="/review/art-direction/b?review=1" aria-current={studio?'page':undefined}>B / Digital studio</Link><span>Local art-direction study · Hero + one section</span></nav>}
 {studio?<section className="studio-hero art-wrap"><p className="art-kicker">MERKADAGENCY / DIGITAL STUDIO</p><h1>Websites people<br /><em>want to use.</em></h1><div className="studio-intro"><p>Websites, CRM integration and AI-assisted workflows—designed around your customers and the way your team works.</p><Link to="/contact" className="art-cta">Request a systems review <ArrowRight aria-hidden="true"/></Link></div><figure className="studio-work">{approvedWork?<><img src={approvedWork.src} alt={`${approvedWork.name} actual website work`} /><figcaption><strong>{approvedWork.name}</strong><span>{approvedWork.description}</span><span>Website design / Actual project</span></figcaption></>:<div className="asset-pending">Project showcase reserved for an approved existing asset. No fabricated screenshot.</div>}</figure></section>:<section className="precision-hero art-wrap"><div><p className="art-kicker">MERKADAGENCY / AI INFRASTRUCTURE</p><h1><span>Your business.</span><em>Connected by</em><span className="headline-final">design.</span></h1><p className="precision-intro">We build websites, connect your CRM, and design AI-assisted workflows around how your team works.</p><Link to="/contact" className="art-cta">Request a systems review <ArrowRight aria-hidden="true"/></Link><p className="hero-availability">Website projects available. CRM integration in testing.<br />Human-reviewed AI workflows available as a pilot.</p></div><ConceptualSystem/></section>}
 {!studio && <section className="inquiry-below art-wrap" aria-labelledby="example-title"><div><p className="art-kicker">AI ASSISTANCE, HUMAN JUDGMENT</p><h2 id="example-title">Turn scattered details into a clear starting point.</h2><p>Explore how AI can organize an inquiry and prepare a reply for your team to review.</p></div><AngularInquiry/></section>}
 <section className="art-offer art-wrap" aria-labelledby="offer-title"><div className="art-offer-heading"><p className="art-kicker">{studio?'DESIGN THAT CONNECTS':'WHAT WE CAN HELP WITH'}</p><h2 id="offer-title">{studio?'The experience. And what happens after.':'Build the part your business needs.'}</h2></div><div className="art-offer-rows">{[['01','Websites','Available for projects','Clear pages and inquiry forms that help customers take the next step.'],['02','CRM integration','In testing','Connect inquiries to your central customer record.'],['03','AI-assisted workflows','Pilot · Human reviewed','Prepare summaries and drafts for your team to review.']].map(([n,name,status,copy])=><article key={name}><span>{n}</span><h3>{name}</h3><p>{copy}</p><small>{status}</small>{!studio && <ServiceGraphic kind={n}/>}</article>)}</div></section>
 </main></div>;
}
