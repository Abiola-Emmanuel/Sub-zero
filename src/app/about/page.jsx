"use client"

import Link from 'next/link';
import {
  FiShield,
  FiPieChart,
  FiBell,
  FiArrowRight,
  FiLock,
  FiZap,
  FiCpu,
  FiTarget,
  FiDollarSign
} from 'react-icons/fi';
import {
  SiNextdotjs,
  SiSupabase,
  SiChartdotjs
} from 'react-icons/si';
import { FaCss3 } from "react-icons/fa";
import { VscGraphLine } from 'react-icons/vsc'; // Alternative for Recharts
import './about.css';
import { useState } from 'react';

const AboutPage = () => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  return (
    <div className="about-wrapper">

      {/* Header */}
      <header className="about-header">
        <div className="header-container">
          <Link href="/" className="logo">
            <span className="logo-text">Sub-Zero</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#how-it-works" className="nav-link">How it Works</Link>
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

      {/* Animated Background */}
      <div className="about-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="about-container">
        {/* Hero Section */}
        <section className="hero-section ">
          <div className="hero-content">
            <h1 className="hero-title">
              <span style={{ color: 'white' }}>Cold.</span>{' '}
              <span style={{ color: '#3ecf8e' }}>Calculated.</span>{' '}
              <span style={{ color: 'white' }}>Control.</span>
            </h1>
            <p className="hero-subtitle">
              We built Sub-Zero to kill the &quot;subscription creep&quot; that quietly drains your bank account.
              No fluff, no ads—just the cold, hard numbers you need to stay on top.
            </p>
            <div className="hero-cta">
              <Link href="/dashboard" className="primary-button">
                Back to My Vault
                <FiArrowRight className="button-icon" />
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-badge">
              <FiDollarSign className="stat-icon" />
              <span>$200+ avg. monthly spend</span>
            </div>
            <div className="stat-badge">
              <FiBell className="stat-icon" />
              <span>40% forget subscriptions</span>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="problem-section">
          <div className="section-header">
            <span className="section-tag">The Problem</span>
            <h2 className="section-title">The Subscription Trap</h2>
            <p className="section-subtitle">
              The average person spends over <span className="highlight">$200 a month</span> on subscriptions,
              and <span className="highlight">40% of people</span> have forgotten about at least one recurring payment.
            </p>
          </div>

          <div className="problem-card glass-effect">
            <div className="problem-content">
              <p className="problem-text">
                We didn&apos;t want another complex spreadsheet. We wanted a <strong>Vault</strong>.
              </p>
              <p className="problem-text">
                Sub-Zero was designed to be your financial defense system, tracking every dollar that leaves
                your account on autopilot.
              </p>
            </div>
            <div className="problem-quote">
              <span className="quote-mark">&quot;</span>
              <p>Your financial command center in a world of subscription chaos.</p>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="pillars-section">
          <div className="section-header">
            <span className="section-tag">Core Pillars</span>
            <h2 className="section-title">The Vault Experience</h2>
          </div>

          <div className="pillars-grid">
            {/* Security Card */}
            <div className="pillar-card glass-effect">
              <div className="pillar-icon-wrapper security">
                <FiShield className="pillar-icon" />
              </div>
              <h3 className="pillar-title">The Vault</h3>
              <p className="pillar-description">
                Your data is protected by <strong>Row-Level Security (RLS)</strong> and industry-standard encryption.
                We never see your data; only you do.
              </p>
              <div className="pillar-features">
                <span className="pillar-feature">🔒 End-to-end encrypted</span>
                <span className="pillar-feature">🛡️ RLS protected</span>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="pillar-card glass-effect">
              <div className="pillar-icon-wrapper analytics">
                <FiPieChart className="pillar-icon" />
              </div>
              <h3 className="pillar-title">Insights Engine</h3>
              <p className="pillar-description">
                We don&apos;t just show you prices; we show you patterns. Detect overlaps, find ghost subscriptions,
                and optimize your <strong>&quot;burn.&quot;</strong>
              </p>
              <div className="pillar-features">
                <span className="pillar-feature">📊 Pattern detection</span>
                <span className="pillar-feature">👻 Ghost sub finder</span>
              </div>
            </div>

            {/* Simplicity Card */}
            <div className="pillar-card glass-effect">
              <div className="pillar-icon-wrapper simplicity">
                <FiZap className="pillar-icon" />
              </div>
              <h3 className="pillar-title">Zero Noise</h3>
              <p className="pillar-description">
                No newsletters, no upselling. Just a clean, dark interface designed for <strong>clarity and speed.</strong>
              </p>
              <div className="pillar-features">
                <span className="pillar-feature">⚡ Lightning fast</span>
                <span className="pillar-feature">🎯 Distraction-free</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="tech-section">
          <div className="section-header">
            <span className="section-tag">For the Geeks</span>
            <h2 className="section-title">Built for the Modern Web</h2>
            <p className="section-subtitle">
              Sub-Zero is a high-performance application built with cutting-edge technology
            </p>
          </div>

          <div className="tech-grid">
            <div className="tech-card glass-effect">
              <SiNextdotjs className="tech-icon nextjs" />
              <h4>Next.js 16</h4>
              <p>Lightning-fast navigation & optimal performance</p>
            </div>

            <div className="tech-card glass-effect">
              <SiSupabase className="tech-icon supabase" />
              <h4>Supabase</h4>
              <p>Secure, real-time data management</p>
            </div>

            <div className="tech-card glass-effect">
              <VscGraphLine className="tech-icon recharts" /> {/* Using VSC icon instead */}
              <h4>Recharts</h4>
              <p>Interactive financial visualizations</p>
            </div>

            <div className="tech-card glass-effect">
              <FaCss3 className="tech-icon tailwind" />
              <h4> CSS</h4>
              <p>Sharp, responsive interface design</p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-card glass-effect">
            <FiTarget className="mission-icon" />
            <h2 className="mission-title">Our Goal</h2>
            <p className="mission-text">
              Our mission is simple: To help you reach <span className="highlight">Monthly Burn: $0.00</span>
            </p>
            <p className="mission-description">
              Whether it&apos;s cutting out that unused gym membership or switching to an annual plan to save 15%,
              we provide the tools to make it happen.
            </p>

            {/* Progress Visualization */}
            <div className="mission-progress">
              <div className="progress-label">
                <span>Current Burn</span>
                <span className="progress-value">$247</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <div className="progress-label target">
                <span>Target: $0</span>
              </div>
            </div>

            <div className="mission-cta">
              <Link href="/dashboard" className="primary-button large">
                Start Saving Today
                <FiArrowRight className="button-icon" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="cta-section">
          <div className="cta-card glass-effect">
            <h3>Ready to take control of your subscriptions?</h3>
            <p>Join thousands of users who&apos;ve stopped the subscription bleed.</p>
            <div className="cta-buttons">
              <Link href="/dashboard" className="primary-button">
                Back to My Vault
              </Link>
              <Link href="/signup" className="secondary-button">
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="about-footer">
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
};

export default AboutPage;