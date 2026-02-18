"use client";

import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import Link from 'next/link';
import './login.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      router.push('/dashboard');
      router.refresh();
    }

    setLoading(false);

  }

  return (
    <div className="auth-wrapper">
      {/* Background gradient effect */}
      <div className="auth-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
      </div>

      <div className="auth-container">
        {/* Left side - Branding/Info (optional) */}
        <div className="auth-brand">
          <div className="brand-content">
            <h1 className="brand-title gradient-text">Sub-Zero</h1>
            <p className="brand-subtitle">Manage your subscriptions with style</p>
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Track all subscriptions</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Never miss a payment</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Save money monthly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Card */}
        <div className="auth-card glass-effect">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Enter your credentials to access your vault</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* <div className="auth-options">
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox" />
                <span className="checkbox-label">Remember me</span>
              </label>
              <Link href="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div> */}

            <button type="submit" className="auth-button">
              <FiLogIn className="button-icon" />
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
            {message && <p style={{ textAlign: 'center', color: 'white' }}>{message}</p>}

          </form>

          <div className="auth-footer">
            <p className="footer-text">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="signup-link">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="demo-hint">
            <p>Demo: demo@subzero.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;