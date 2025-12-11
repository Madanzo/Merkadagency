'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Icons components
const StarIcon = () => (
  <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const VerifiedIcon = () => (
  <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ClientsIcon = () => (
  <svg className="badge-icon" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
  </svg>
);

// Service data
const services = [
  {
    icon: '🤖',
    title: 'AI Lead Capture',
    description: 'Convert visitors into booked calls with on-site AI agents and smart routing systems that qualify leads 24/7.',
    link: '/service'
  },
  {
    icon: '💻',
    title: 'Website Development',
    description: 'Professional websites with AI agents, CRM integration, and conversion-optimized design that drives results.',
    link: '/service'
  },
  {
    icon: '📧',
    title: 'CRM + Email/SMS',
    description: 'Automated nurture sequences that engage leads until they book—without lifting a finger.',
    link: '/service'
  },
  {
    icon: '🔍',
    title: 'AI SEO Automation',
    description: 'Publish, interlink, and rank faster with supervised AI workflows that scale your organic reach.',
    link: '/service'
  },
  {
    icon: '🎬',
    title: 'Content Systems',
    description: 'Shorts, long-form, and repurposing that compound awareness into bookings across all platforms.',
    link: '/service'
  }
];

// Process steps
const processSteps = [
  { number: 1, title: 'Audit', description: 'Deep-dive analysis of your current systems and opportunities' },
  { number: 2, title: 'Plan', description: 'Custom strategy tailored to your business goals' },
  { number: 3, title: 'Implement', description: 'Rapid deployment of AI-powered systems' },
  { number: 4, title: 'Optimize', description: 'Weekly improvements based on real-time data' }
];

// Stats data
const stats = [
  { number: '500+', label: 'Automated Workflows Built' },
  { number: '$2.4M', label: 'Revenue Generated' },
  { number: '98%', label: 'Client Retention' },
  { number: '24/7', label: 'AI Agent Uptime' }
];

export default function Home() {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'paused';
      observer.observe(el);
    });

    // Dynamic particle generation
    const particlesContainer = document.querySelector('.particles');

    const createParticle = () => {
      if (!particlesContainer) return;

      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 25000);
    };

    const interval = setInterval(createParticle, 3000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Tech Grid Background */}
      <div className="tech-grid"></div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i + 1) * 10}%`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text slide-in-left">
              <h1>AI-Powered Growth Systems That Convert</h1>
              <p className="subhead">Transform your traffic into booked revenue with intelligent automation, without adding headcount.</p>

              <div className="cta-group">
                <Link href="/book" className="btn-primary">
                  Book a Strategy Call
                  <span>→</span>
                </Link>
                <a href="#services" className="btn-secondary">Explore Services</a>
              </div>

              <div className="trust-badges">
                <div className="badge">
                  <StarIcon />
                  <span>5-Star Reviews</span>
                </div>
                <div className="badge">
                  <VerifiedIcon />
                  <span>Verified Agency</span>
                </div>
                <div className="badge">
                  <ClientsIcon />
                  <span>100+ Clients</span>
                </div>
              </div>
            </div>

            <div className="hero-visual slide-in-right">
              <div className="tech-card">
                <div className="metric-grid">
                  <div className="metric-item">
                    <div className="metric-value">+38%</div>
                    <div className="metric-label">Booked Calls</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">-62%</div>
                    <div className="metric-label">Cost Per Lead</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">24/7</div>
                    <div className="metric-label">AI Support</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">5x</div>
                    <div className="metric-label">ROI Average</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header fade-in">
            <h2>Intelligent Growth Solutions</h2>
            <p>Cutting-edge AI systems that transform your business operations and accelerate revenue growth</p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`service-card fade-in ${index > 0 ? `delay-${index}00` : ''}`}
              >
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>
                <Link href={service.link} className="service-link">Explore Service →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process">
        <div className="container">
          <div className="section-header fade-in">
            <h2>How We Transform Your Business</h2>
            <p>Our proven 4-step process delivers measurable results in weeks, not months</p>
          </div>

          <div className="timeline">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className={`timeline-item fade-in ${index > 0 ? `delay-${index}00` : ''}`}
              >
                <div className="timeline-dot">{step.number}</div>
                <h3 className="timeline-title">{step.title}</h3>
                <p className="timeline-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`stat-card fade-in ${index > 0 ? `delay-${index}00` : ''}`}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Scale Your Business?</h2>
              <p className="cta-subtitle">Let&apos;s build AI systems that work while you sleep</p>
              <Link href="/book" className="btn-white">
                Book Your Strategy Call
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
