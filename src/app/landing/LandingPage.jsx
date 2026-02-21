"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiTrendingUp,
  FiBell,
  FiPieChart,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiCreditCard,
  FiCalendar,
  FiLayers
} from 'react-icons/fi';
import './landing.css';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Simple intersection observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-wrapper">

      {/* Animated Background */}
      <div className="landing-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <Link href="/" className="logo">
            <span className="logo-text">Sub-Zero</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#pricing" className="nav-link">Pricing</Link>
            <Link href="/about" className="nav-link">About</Link>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="btn-secondary">Log In</Link>
            <Link href="/signup" className="btn-primary">
              Initialize Vault
              <FiArrowRight className="btn-icon" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            <Link href="#features" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#pricing" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Stop the <span>Subscription Bleed</span>
            </h1>
            <p className="hero-subtitle">
              The command center for your cash. Track, analyze, and optimize every subscription
              in one place. No more death by a thousand cuts.
            </p>
            <div className="hero-cta">
              <Link href="/signup" className="btn-primary btn-large">
                Get Started Free
                <FiArrowRight className="btn-icon" />
              </Link>
              <p className="cta-note">No credit card required</p>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">$2.5M+</span>
                <span className="stat-label">Saved by users</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">10k+</span>
                <span className="stat-label">Active vaults</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">50k+</span>
                <span className="stat-label">Subscriptions tracked</span>
              </div>
            </div>
          </div>

          <div className="hero-visual fade-in">
            <div className="visual-container glass-effect">
              {/* Image version - use this now */}

              <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                <Image
                  src="/dashboard-screenshot.png"
                  alt="Sub-Zero Dashboard Preview"
                  fill
                  style={{ objectFit: 'cover' }} // This makes the image cover the area nicely
                  priority // Good for LCP
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header fade-in">
            <h2 className="section-title">The Vault Experience</h2>
            <p className="section-subtitle">Everything you need to master your subscriptions</p>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-effect fade-in">
              <div className="feature-icon-wrapper">
                <FiTrendingUp className="feature-icon" />
              </div>
              <h3 className="feature-title">Burn Rate Analytics</h3>
              <p className="feature-description">
                See exactly how much you&apos;re spending monthly. Identify &quot;ghost subscriptions&quot; you forgot about.
              </p>
            </div>

            <div className="feature-card glass-effect fade-in">
              <div className="feature-icon-wrapper">
                <FiBell className="feature-icon" />
              </div>
              <h3 className="feature-title">Smart Reminders</h3>
              <p className="feature-description">
                Never miss a payment with upcoming bill notifications. Always stay in control.
              </p>
            </div>

            <div className="feature-card glass-effect fade-in">
              <div className="feature-icon-wrapper">
                <FiPieChart className="feature-icon" />
              </div>
              <h3 className="feature-title">Category Breakdown</h3>
              <p className="feature-description">
                Group subscriptions by category—entertainment, utilities, productivity—and see where your money goes.
              </p>
            </div>
          </div>

          <div className="feature-highlight fade-in">
            <div className="highlight-content">
              <span className="highlight-tag">NEW</span>
              <h3 className="highlight-title">Identify 30% in &apos;Ghost Subscriptions&apos; within minutes</h3>
              <p className="highlight-text">
                Our analysis shows most users find forgotten subscriptions worth 30% of their monthly spend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <div className="section-header fade-in">
            <h2 className="section-title">Initialize Your Vault in 3 Steps</h2>
            <p className="section-subtitle">Simple, fast, and effective</p>
          </div>

          <div className="steps-grid">
            <div className="step-card fade-in">
              <div className="step-number">1</div>
              <div className="step-icon-wrapper">
                <FiCheckCircle className="step-icon" />
              </div>
              <h3 className="step-title">Sign Up</h3>
              <p className="step-description">
                Create your free account in seconds. No credit card required.
              </p>
            </div>

            <div className="step-card fade-in">
              <div className="step-number">2</div>
              <div className="step-icon-wrapper">
                <FiCreditCard className="step-icon" />
              </div>
              <h3 className="step-title">Add Subscriptions</h3>
              <p className="step-description">
                List your subscriptions manually or import from email.
              </p>
            </div>

            <div className="step-card fade-in">
              <div className="step-number">3</div>
              <div className="step-icon-wrapper">
                <FiLayers className="step-icon" />
              </div>
              <h3 className="step-title">Start Saving</h3>
              <p className="step-description">
                Get insights, cancel unused subs, and watch your savings grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="testimonial-section">
        <div className="section-container">
          <div className="testimonial-card glass-effect fade-in">
            <FiStar className="testimonial-quote" />
            <p className="testimonial-text">
              &quot;Sub-Zero helped me save over $200/month on subscriptions I forgot about!
              The clean dashboard and reminders are a game-changer.&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div className="author-info">
                <span className="author-name">John Doe</span>
                <span className="author-title">Verified Beta User</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <div className="section-header fade-in">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Start free, upgrade when you need more</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card glass-effect fade-in">
              <h3 className="pricing-title">Free Forever</h3>
              <div className="pricing-price">
                <span className="price-amount">$0</span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li><FiCheckCircle className="check-icon" /> Up to 20 subscriptions</li>
                <li><FiCheckCircle className="check-icon" /> Basic analytics</li>
                <li><FiCheckCircle className="check-icon" /> Email reminders</li>
                <li><FiCheckCircle className="check-icon" /> Category tracking</li>
              </ul>
              <Link href="/signup" className="btn-primary btn-block">
                Get Started
              </Link>
            </div>

            <div className="pricing-card glass-effect fade-in featured">
              <div className="featured-badge">Coming Soon</div>
              <h3 className="pricing-title">Pro</h3>
              <div className="pricing-price">
                <span className="price-amount">$4.99</span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li><FiCheckCircle className="check-icon" /> Unlimited subscriptions</li>
                <li><FiCheckCircle className="check-icon" /> Advanced analytics</li>
                <li><FiCheckCircle className="check-icon" /> Bank syncing</li>
                <li><FiCheckCircle className="check-icon" /> Priority support</li>
              </ul>
              <button className="btn-secondary btn-block" disabled>Pre-register</button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card glass-effect fade-in">
            <h2 className="cta-title">Ready to stop the subscription bleed?</h2>
            <p className="cta-subtitle">Join thousands of users taking control of their finances.</p>
            <Link href="/signup" className="btn-primary btn-large">
              Initialize Your Vault Now
              <FiArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              {/* <span className="logo-icon">❄️</span> */}
              <span className="logo-text">Sub-Zero</span>
            </div>
            <p className="footer-tagline">The command center for your cash.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <Link href="#features">Features</Link>
              <Link href="#pricing">Pricing</Link>
              <Link href="#how-it-works">How it Works</Link>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Sub-Zero. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}