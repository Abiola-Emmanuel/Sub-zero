"use client"

import './dashboard.css';
import Link from 'next/link';
import { FiPlus, FiTrendingUp, FiCalendar, FiLayers } from 'react-icons/fi';
import SubscriptionGrid from '@/components/SubscriptionGrid';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function DashboardPage() {

  const [user, setUser] = useState(null);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true)

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/landing');
          return;
        }

        // Fetch both at the same time for speed
        const [profileRes, subsRes] = await Promise.all([
          supabase.from('users').select('name').eq('id', authUser.id).single(),
          supabase.from('subscriptions').select('*').eq('user_id', authUser.id)
        ]);

        setUser({ ...authUser, ...profileRes.data });
        setSubs(subsRes.data || []);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, [router, supabase]);

  // Calculations
  // Note to self: A Set is a special object in JavaScript that only allows unique values. If you try to put the same word in twice, it simply ignores the second one. 
  // And also, For an Array, you use .length. For a Set, you use .size. It tells you how many items are left after the duplicates were kicked out.
  const totalSpend = subs.reduce((sum, sub) => sum + Number(sub.price), 0);

  const upcomingSub = [...subs].sort((a, b) => new Date(a.next_bill_date) - new Date(b.next_bill_date))[0];

  const categoryCount = new Set(subs.map(s => s.category)).size;

  const totalMonthlyBurn = subs.reduce((sum, sub) => {
    const price = parseFloat(sub.price) || 0;
    if (sub.billing_cycle === 'yearly') return sum + (price / 12);
    if (sub.billing_cycle === 'weekly') return sum + (price * 4);
    return sum + price; // Default for monthly
  }, 0);

  // Loading state ui

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Decrypting your vault...</p>
        </div>
      </div>
    )
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to remove this subscription?');

    if (!confirmed) return;

    const { error } = await supabase.from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting:' + error.message)
    } else {
      setSubs(prev => prev.filter(sub => sub.id !== id))
    }
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="">Overview</h1>
          <p className="header-subtitle">Welcome back, {user?.name || 'User'}</p>
        </div>
        <Link href="/add-sub" className="primary-button">
          <FiPlus className="button-icon" />
          Add New Subscription
        </Link>
      </header>

      {/* Top Stats Row */}
      <section className="stats-grid">
        <div className="stat-card glass-effect">
          <div className="stat-icon-wrapper">
            <FiTrendingUp className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Monthly Burn</span>
            <span className="stat-value">${totalMonthlyBurn.toFixed(2)}</span>
            <span className="stat-trend">
              {subs.length > 0 ? 'Active subscriptions' : 'No active subs'}
            </span>
          </div>
        </div>

        <div className="stat-card glass-effect">
          <div className="stat-icon-wrapper">
            <FiLayers className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Subscriptions</span>
            <span className="stat-value">{subs.length}</span>
            <span className="stat-trend">
              {categoryCount} categories
            </span>
          </div>
        </div>

        <div className="stat-card glass-effect">
          <div className="stat-icon-wrapper">
            <FiCalendar className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Next Bill Due</span>
            <span className="stat-value">
              {upcomingSub ? upcomingSub.name : 'No upcoming'}
            </span>
            {upcomingSub && (
              <span className="stat-trend">
                {new Date(upcomingSub.next_bill_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Subscriptions Grid */}
      <section className="subscriptions-section">
        <div className="section-header">
          <h2 className="section-title">Active Subscriptions</h2>
          {subs.length > 0 && (
            <span className="subscription-count">{subs.length} total</span>
          )}
        </div>

        {subs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <p>No active subscriptions yet</p>
              <Link href="/add-sub" className="secondary-button">
                Get started by adding your first subscription
              </Link>
            </div>
          </div>
        ) : (
          <SubscriptionGrid initialSubs={subs} onDelete={handleDelete} />
        )}
      </section>
    </div>
  );
}