import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
export default function NotFound(){return <Layout><section className="public-editorial container-custom"><p className="public-caption">404</p><h1>Page not found.</h1><p className="public-lead">The address may have changed. Explore our services or return to the homepage.</p><nav className="public-related" aria-label="Find a page"><Link to="/">Homepage</Link><Link to="/services">Services</Link><Link to="/contact">Contact</Link></nav></section></Layout>}
