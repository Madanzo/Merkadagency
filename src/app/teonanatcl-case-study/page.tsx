'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function TeonanatclCaseStudy() {
  const animatedElements = useRef<Set<HTMLElement>>(new Set());

  useEffect(() => {
    // Intersection Observer for fade-in animations
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

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'paused';
      observer.observe(el);
    });

    // Number animation logic
    const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
      const range = end - start;
      const increment = range / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        // Update the displayed value
        element.textContent = Math.floor(current).toString();
      }, 16);
    };

    const numberObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        // Check if already animated to avoid re-triggering
        if (entry.isIntersecting && !animatedElements.current.has(target)) {
          animatedElements.current.add(target);

          const text = target.textContent || '';
          // Original script filter: ONLY animate if NO special chars
          if (!text.includes('%') && !text.includes('+') && !text.includes('/')) {
            const value = parseInt(text);
            if (!isNaN(value)) {
              animateValue(target, 0, value, 1500);
            }
          }
        }
      });
    }, { threshold: 0.5 });

    const metricValues = document.querySelectorAll('.metric-value, .hero-metric-value');
    metricValues.forEach(el => {
      numberObserver.observe(el);
    });

    return () => {
      observer.disconnect();
      numberObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className="tech-grid"></div>

      <section className="case-hero">
        <div className="container">
          <div className="case-hero-content">
            <div className="case-hero-text">
              <div className="client-badge">
                <span>🌿</span>
                <span>Wellness & Spiritual Services</span>
              </div>
              <h1>How Teonanatcl Achieved Professional Online Presence with AI-Built Website & CRM</h1>
              <p className="case-subtitle">From zero digital presence to a professional wellness platform with integrated booking system, dramatically improving Google visibility and client acquisition.</p>

              <div className="hero-metrics">
                <div className="hero-metric">
                  <div className="hero-metric-value">500%+</div>
                  <div className="hero-metric-label">Search Visibility</div>
                </div>
                <div className="hero-metric">
                  <div className="hero-metric-value">100%</div>
                  <div className="hero-metric-label">AI-Generated Content</div>
                </div>
                <div className="hero-metric">
                  <div className="hero-metric-value">24/7</div>
                  <div className="hero-metric-label">Automated Booking</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image">
                <Image
                  src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d17bdd83739a3e136f28ff.png"
                  alt="Teonanatcl Professional Website"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="challenge-section">
        <div className="container">
          <div className="section-header">
            <h2>The Challenge</h2>
            <p>Spiritual wellness practitioners struggled with unprofessional online presence</p>
          </div>

          <div className="challenge-grid">
            <div className="challenge-card fade-in">
              <h3 className="challenge-title">No Professional Website</h3>
              <p className="challenge-desc">Operating without a credible online presence, making it difficult for potential clients to find or trust their wellness services.</p>
            </div>

            <div className="challenge-card fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="challenge-title">Zero Google Visibility</h3>
              <p className="challenge-desc">Completely invisible in search results, missing out on organic traffic and potential client discovery.</p>
            </div>

            <div className="challenge-card fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="challenge-title">Manual Booking Process</h3>
              <p className="challenge-desc">Relying on phone calls and text messages for appointments, leading to missed opportunities and scheduling conflicts.</p>
            </div>

            <div className="challenge-card fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="challenge-title">Limited Client Management</h3>
              <p className="challenge-desc">No system to track client interactions, follow up on inquiries, or nurture relationships with potential clients.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="solution-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Solution</h2>
            <p>Complete digital transformation with AI-powered website and CRM integration</p>
          </div>

          <div className="solution-grid">
            <div className="solution-card fade-in">
              <div className="solution-icon">🌐</div>
              <h3 className="solution-title">AI-Generated Professional Website</h3>
              <p className="solution-desc">Built a complete HTML website using AI-generated content, creating professional credibility and showcasing wellness services effectively.</p>
              <div className="solution-stat">100% AI Content</div>
            </div>

            <div className="solution-card fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="solution-icon">📈</div>
              <h3 className="solution-title">Google Search Optimization</h3>
              <p className="solution-desc">Implemented comprehensive SEO strategy to achieve visibility in Google search results for wellness and spiritual service keywords.</p>
              <div className="solution-stat">500%+ Visibility Increase</div>
            </div>

            <div className="solution-card fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="solution-icon">📅</div>
              <h3 className="solution-title">Integrated CRM & Booking System</h3>
              <p className="solution-desc">Automated booking platform allowing clients to schedule appointments online, with CRM integration for client management and follow-ups.</p>
              <div className="solution-stat">24/7 Availability</div>
            </div>

            <div className="solution-card fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="solution-icon">📧</div>
              <h3 className="solution-title">Client Communication System</h3>
              <p className="solution-desc">Automated email sequences for appointment confirmations, reminders, and follow-up care to enhance client experience.</p>
              <div className="solution-stat">Automated Follow-ups</div>
            </div>
          </div>
        </div>
      </section>

      <section className="results-section">
        <div className="container">
          <div className="section-header">
            <h2>The Results</h2>
            <p>Dramatic improvements in online presence and client acquisition</p>
          </div>

          <div className="results-grid">
            <div className="result-block fade-in">
              <div className="result-header">
                <h3 className="result-title">Google Search Console Performance</h3>
                <span className="result-badge">Professional Digital Presence</span>
              </div>

              <div className="metrics-showcase">
                <div className="metric-card">
                  <div className="metric-value">500%+</div>
                  <div className="metric-label">Search Visibility Increase</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">100%</div>
                  <div className="metric-label">AI-Generated Content</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">Top 10</div>
                  <div className="metric-label">Keyword Rankings</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">24/7</div>
                  <div className="metric-label">Online Availability</div>
                </div>
              </div>

              <div className="result-image">
                <Image
                  src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d17db51a53e248ade6c1ec.png"
                  alt="Google Search Console Results"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="result-block fade-in">
              <div className="result-header">
                <h3 className="result-title">Website Analytics Growth</h3>
                <span className="result-badge">Organic Traffic Success</span>
              </div>

              <div className="result-image">
                <Image
                  src="https://storage.googleapis.com/msgsndr/B3r5jIhXrxu7hUG7cLQF/media/68d17db5fefaa98b7442bc48.png"
                  alt="Website Analytics Growth"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="result-block fade-in">
              <div className="result-header">
                <h3 className="result-title">CRM & Booking System</h3>
                <span className="result-badge">Seamless Client Experience</span>
              </div>

              <div className="metrics-showcase">
                <div className="metric-card">
                  <div className="metric-value">100%</div>
                  <div className="metric-label">Automated Booking</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">0</div>
                  <div className="metric-label">Missed Appointments</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">24/7</div>
                  <div className="metric-label">Client Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-box">
            <div className="quote-icon">&quot;</div>
            <p className="testimonial-text">
              &quot;MerkadAgency transformed our entire digital presence from nothing to a professional wellness platform. The AI-generated website looks incredibly professional, and we&apos;re now visible on Google for the first time. The integrated booking system has eliminated scheduling conflicts and allows clients to book appointments anytime. We&apos;ve gone from invisible online to having a credible digital presence that actually brings in new clients.&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">T</div>
              <div className="author-info">
                <div className="author-name">Teonanatcl Team</div>
                <div className="author-title">Wellness & Spiritual Services</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <h2 className="cta-title">Ready for Professional Digital Presence?</h2>
              <p className="cta-subtitle">Get your AI-built website and CRM system like Teonanatcl</p>
              <a href="/book" className="btn-white">
                Book Your Strategy Call
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
