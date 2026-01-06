import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'AI Lead Capture', href: '/services/ai-lead-capture' },
    { name: 'CRM Automation', href: '/services/crm-automation' },
    { name: 'SEO & Content', href: '/services/seo-content' },
    { name: 'Paid Advertising', href: '/services/paid-advertising' },
  ],
  industries: [
    { name: 'Medical Spas', href: '/industries/medspas' },
    { name: 'Cannabis', href: '/industries/cannabis' },
    { name: 'Construction', href: '/industries/construction' },
    { name: 'E-Commerce', href: '/industries/ecommerce' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Method', href: '/about/method' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Free Audit', href: '/resources/free-audit' },
    { name: 'ROI Calculator', href: '/resources/roi-calculator' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Case Studies', href: '/case-studies' },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-merkad-bg-primary border-t border-white/5">
      {/* Main Footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Elegant_Merkadagency_logo%201.png?alt=media&token=eccf7036-fa7a-4694-a97a-9f81a7fb624e"
                alt="MerkadAgency"
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 text-merkad-text-secondary max-w-sm">
              AI-Powered Growth Systems for Service Businesses. We build automation systems that turn your website traffic into booked revenue.
            </p>
            <div className="mt-6 flex gap-4">
              {/* Social Links - placeholders */}
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-merkad-bg-tertiary flex items-center justify-center text-merkad-text-muted hover:text-white hover:bg-merkad-bg-elevated transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-merkad-bg-tertiary flex items-center justify-center text-merkad-text-muted hover:text-white hover:bg-merkad-bg-elevated transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-merkad-text-secondary hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Industries</h4>
            <ul className="space-y-3">
              {footerLinks.industries.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-merkad-text-secondary hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-merkad-text-secondary hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-merkad-text-secondary hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 rounded-2xl bg-merkad-bg-tertiary border border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-display font-bold text-white">Ready to grow?</h4>
              <p className="text-merkad-text-secondary mt-1">
                Book a discovery call and see how we can automate your growth.
              </p>
            </div>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-purple text-white font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Book Discovery Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-merkad-text-muted text-sm">
            © 2025 MerkadAgency. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/legal/privacy" className="text-sm text-merkad-text-muted hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/legal/terms" className="text-sm text-merkad-text-muted hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}