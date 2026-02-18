"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiPieChart,
  FiSettings,
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiCreditCard,
  FiTrendingUp,
  FiCalendar
} from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [stats, setStats] = useState({ monthly: 0, active: 0 })
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getNavData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // Fetch profile and subscriptions in parallel
        const [profileRes, subsRes] = await Promise.all([
          supabase.from('users').select('name').eq('id', authUser.id).single(),
          supabase.from('subscriptions').select('price, billing_cycle').eq('user_id', authUser.id)
        ]);

        setUser({ ...authUser, ...profileRes.data });

        // Calculate stats for the navbar
        if (subsRes.data) {
          const monthlyBurn = subsRes.data.reduce((sum, sub) => {
            const price = parseFloat(sub.price) || 0;
            if (sub.billing_cycle === 'yearly') return sum + (price / 12);
            if (sub.billing_cycle === 'weekly') return sum + (price * 4.33);
            return sum + price;
          }, 0);

          setStats({
            monthly: monthlyBurn,
            active: subsRes.data.length
          });
        }
      }
    };
    getNavData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/analytics', label: 'Analytics', icon: FiPieChart },
    { href: '/subscriptions', label: 'Subscriptions', icon: FiCreditCard },
    { href: '/insights', label: 'Insights', icon: FiTrendingUp },
    { href: '/calendar', label: 'Calendar', icon: FiCalendar },
    { href: '/settings', label: 'Settings', icon: FiSettings },
  ];

  // Don't show navbar on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="nav-overlay" onClick={() => setIsOpen(false)} />}

      {/* Navbar */}
      <nav className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="nav-brand">
          <Link href="/dashboard" className="brand-link">
            {/* <span className="brand-icon">❄️</span> */}
            <span className="brand-text">Sub-Zero</span>
          </Link>
        </div>

        <div className="nav-links">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{link.label}</span>
                {isActive && <span className="active-indicator" />}
              </Link>
            );
          })}
        </div>

        <div className="nav-footer">
          {/* Notifications */}
          {/* <div className="notifications-wrapper">
            <button
              className="notification-btn"
              onClick={() => router.push('/notifications')}
            >
              <FiBell className="notification-icon" />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>
          </div> */}

          {/* Profile Section */}
          <div className="profile-section">
            <button
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.name || 'User'}</span>
                <span className="profile-email">{user?.email?.substring(0, 20)}...</span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="dropdown-user-info">
                    <span className="dropdown-name">{user?.name || 'User'}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                </div>

                <div className="dropdown-menu">
                  <Link href="/profile" className="dropdown-item">
                    <FiUser className="dropdown-icon" />
                    <span>Your Profile</span>
                  </Link>
                  <Link href="/settings" className="dropdown-item">
                    <FiSettings className="dropdown-icon" />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <FiLogOut className="dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats - Optional Mini Stats */}
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="quick-stat-label">Monthly</span>
              <span className="quick-stat-value">${stats.monthly.toFixed(0)}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-label">Active</span>
              <span className="quick-stat-value">{stats.active}</span>
            </div>
          </div>
        </div>
      </nav>

    </>
  );
};

export default Navbar;