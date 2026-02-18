"use client";

import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import './signup.css';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();


  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    })

    if (error) {
      setMessage(error.message)
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: dbError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          email: email,
          name: name
        }
      ])

      if (dbError) {
        console.error('Database error:', dbError.message);
      } else {
        router.push('/login?status=success')
      }
    }
    setLoading(false)
  }


  return (
    <div className="auth-wrapper">
      {/* Background gradient effect */}
      <div className="auth-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
      </div>

      <div className="auth-container">
        {/* Left side - Branding/Info */}
        <div className="auth-brand">
          <div className="brand-content">
            <h1 className="brand-title gradient-text">Sub-Zero</h1>
            <p className="brand-subtitle">Join thousands managing their subscriptions smarter</p>

            {/* Stats/Benefits */}
            <div className="brand-stats">
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$2.5M</span>
                <span className="stat-label">Saved Monthly</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50k+</span>
                <span className="stat-label">Subscriptions</span>
              </div>
            </div>

            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Track all subscriptions in one place</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Get payment reminders</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Analyze spending patterns</span>
              </div>
              <div className="feature-item">
                <div className="feature-dot"></div>
                <span>Cancel unwanted subscriptions</span>
              </div>
            </div>

            {/* Testimonial */}
            <div className="brand-testimonial">
              <p className="testimonial-text">
                &quot;Sub-Zero helped me save over $200/month on subscriptions I forgot about!&quot;
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <span className="author-name">John Doe</span>
                  <span className="author-title">Verified User</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Signup Card */}
        <div className="auth-card glass-effect">
          <div className="auth-header">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Start managing your subscriptions today</p>
          </div>

          <form onSubmit={handleSignup} className="auth-form">
            {/* Name Field */}
            <div className="input-group">
              <label htmlFor="name" className="input-label">Full Name</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="password-requirements">
                <span className="requirement-item">Min 8 characters</span>
                <span className="requirement-item">1 uppercase</span>
                <span className="requirement-item">1 number</span>
              </div>
            </div>

            {/* Terms Agreement */}
            {/* <div className="terms-agreement">
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox" required />
                <span className="checkbox-label">
                  I agree to the{' '}
                  <Link href="/terms" className="terms-link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="terms-link">Privacy Policy</Link>
                </span>
              </label>
            </div> */}

            {/* Signup Button */}
            <button type="submit" className="auth-button">
              <FiLogIn className="button-icon" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {message && <p style={{ textAlign: 'center', color: 'white' }}>{message}</p>}
          </form>


          <div className="auth-footer">
            <p className="footer-text">
              Already have an account?{' '}
              <Link href="/login" className="signup-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;