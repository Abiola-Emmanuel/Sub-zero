"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client";
import {
  FiAlertTriangle,
  FiZap,
  FiTarget,
  FiArrowRight,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
  FiCalendar
} from 'react-icons/fi';
import Link from "next/link";
import './insights.css';

const InsightsPage = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);
        setSubs(data || []);
      }
      setLoading(false);
    };
    fetchInsights();
  }, [supabase]);

  // Insight logic 1: Overlap detection
  const getOverlaps = () => {
    const counts = subs.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .filter(([cat, count]) => count > 2)
      .map(([cat]) => cat);
  };

  // Insight logic 2: Yearly Savings Potential
  const yearlyPotential = subs
    .filter(s => s.billing_cycle === 'monthly' && Number(s.price) > 20)
    .map(s => s.name);

  // Additional insights
  const totalMonthlyBurn = subs.reduce((acc, s) => acc + Number(s.price), 0);
  const suggestedBudget = 150;
  const potentialSavings = totalMonthlyBurn > suggestedBudget
    ? ((totalMonthlyBurn - suggestedBudget) * 12).toFixed(2)
    : 0;

  const unusedSubs = subs.filter(s => {
    const lastUsed = new Date(s.last_used || s.start_date);
    const monthsAgo = (new Date() - lastUsed) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo > 3;
  }).map(s => s.name);

  const upcomingRenewals = subs
    .filter(s => {
      const nextBill = new Date(s.next_bill_date);
      const daysUntil = (nextBill - new Date()) / (1000 * 60 * 60 * 24);
      return daysUntil <= 7 && daysUntil > 0;
    })
    .sort((a, b) => new Date(a.next_bill_date) - new Date(b.next_bill_date));

  if (loading) {
    return (
      <div className="insights-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Analyzing your financial patterns...</p>
        </div>
      </div>
    );
  }

  const overlaps = getOverlaps();

  return (
    <div className="insights-wrapper">
      {/* Animated Background */}
      <div className="insights-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="insights-container">
        {/* Header */}
        <header className="insights-header">
          <div className="header-content">
            <h1 style={{ color: 'white' }}>Smart Insights</h1>
            <p className="header-subtitle">Automated audit of your spending habits</p>
          </div>

          {/* Quick Stats */}
          <div className="header-stats">
            <div className="header-stat">
              <span className="header-stat-label">Total Subs</span>
              <span className="header-stat-value">{subs.length}</span>
            </div>
            <div className="header-stat">
              <span className="header-stat-label">Monthly</span>
              <span className="header-stat-value">${totalMonthlyBurn.toFixed(2)}</span>
            </div>
          </div>
        </header>

        {/* Insights Grid */}
        <div className="insights-grid">
          {/* Insight 1: Overlap Warning */}
          {overlaps.length > 0 && (
            <div className="insight-card warning glass-effect">
              <div className="insight-card-header">
                <div className="insight-icon-wrapper warning">
                  <FiAlertTriangle className="insight-icon" />
                </div>
                <span className="insight-badge">Action Needed</span>
              </div>
              <div className="insight-content">
                <h3 className="insight-title">Subscription Overlap Detected</h3>
                <p className="insight-description">
                  You have <strong className="highlight">{overlaps.length}</strong> categories with multiple subscriptions:
                </p>
                <div className="insight-tags">
                  {overlaps.map(cat => (
                    <span key={cat} className="insight-tag">{cat}</span>
                  ))}
                </div>
                <p className="insight-footnote">
                  Consider if you&apos;re getting value from all of them.
                </p>
                <Link href="/subscriptions" className="insight-link">
                  Review subscriptions <FiArrowRight />
                </Link>
              </div>
            </div>
          )}

          {/* Insight 2: Annual Savings */}
          {yearlyPotential.length > 0 && (
            <div className="insight-card savings glass-effect">
              <div className="insight-card-header">
                <div className="insight-icon-wrapper savings">
                  <FiZap className="insight-icon" />
                </div>
                <span className="insight-badge">Savings Opportunity</span>
              </div>
              <div className="insight-content">
                <h3 className="insight-title">Yearly Savings Potential</h3>
                <p className="insight-description">
                  Switching to annual billing could save you:
                </p>
                <div className="savings-calculator">
                  <div className="saving-item">
                    <span className="saving-label">Current monthly:</span>
                    <span className="saving-value">${yearlyPotential.reduce((sum, name) => {
                      const sub = subs.find(s => s.name === name);
                      return sum + Number(sub?.price || 0);
                    }, 0).toFixed(2)}</span>
                  </div>
                  <div className="saving-item">
                    <span className="saving-label">Estimated annual:</span>
                    <span className="saving-value green">$
                      {(yearlyPotential.reduce((sum, name) => {
                        const sub = subs.find(s => s.name === name);
                        return sum + Number(sub?.price || 0);
                      }, 0) * 12 * 0.85).toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="insight-footnote">
                  Potential savings: <strong className="green">15% annually</strong>
                </p>
              </div>
            </div>
          )}

          {/* Insight 3: Burn Target */}
          <div className="insight-card goal glass-effect">
            <div className="insight-card-header">
              <div className="insight-icon-wrapper goal">
                <FiTarget className="insight-icon" />
              </div>
              <span className="insight-badge">Goal Setting</span>
            </div>
            <div className="insight-content">
              <h3 className="insight-title">Monthly Burn Goal</h3>
              <div className="goal-meter">
                <div className="goal-progress">
                  <div
                    className="goal-fill"
                    style={{ width: `${Math.min((totalMonthlyBurn / suggestedBudget) * 100, 100)}%` }}
                  />
                </div>
                <div className="goal-labels">
                  <span>Current: <strong className={totalMonthlyBurn > suggestedBudget ? 'warning-text' : 'green'}>
                    ${totalMonthlyBurn.toFixed(2)}
                  </strong></span>
                  <span>Target: <strong>${suggestedBudget}</strong></span>
                </div>
              </div>
              {totalMonthlyBurn > suggestedBudget && (
                <p className="insight-description">
                  You&apos;re <strong className="warning-text">${(totalMonthlyBurn - suggestedBudget).toFixed(2)}</strong> over budget.
                  Reducing to ${suggestedBudget} could save <strong className="green">${potentialSavings}/year</strong>.
                </p>
              )}
            </div>
          </div>

          {/* Insight 4: Unused Subscriptions */}
          {unusedSubs.length > 0 && (
            <div className="insight-card unused glass-effect">
              <div className="insight-card-header">
                <div className="insight-icon-wrapper unused">
                  <FiTrendingDown className="insight-icon" />
                </div>
                <span className="insight-badge">Ghost Subs</span>
              </div>
              <div className="insight-content">
                <h3 className="insight-title">Unused Subscriptions</h3>
                <p className="insight-description">
                  You haven&apos;t used these in over 3 months:
                </p>
                <div className="unused-list">
                  {unusedSubs.slice(0, 3).map(name => (
                    <div key={name} className="unused-item">
                      <span className="unused-name">{name}</span>
                      <span className="unused-savings">
                        -${subs.find(s => s.name === name)?.price}/mo
                      </span>
                    </div>
                  ))}
                  {unusedSubs.length > 3 && (
                    <p className="unused-more">+{unusedSubs.length - 3} more</p>
                  )}
                </div>
                <Link href="/subscriptions" className="insight-link">
                  Review unused subs <FiArrowRight />
                </Link>
              </div>
            </div>
          )}

          {/* Insight 5: Upcoming Renewals */}
          {upcomingRenewals.length > 0 && (
            <div className="insight-card renewal glass-effect">
              <div className="insight-card-header">
                <div className="insight-icon-wrapper renewal">
                  <FiCalendar className="insight-icon" />
                </div>
                <span className="insight-badge">Coming Up</span>
              </div>
              <div className="insight-content">
                <h3 className="insight-title">Upcoming Renewals</h3>
                <div className="renewal-list">
                  {upcomingRenewals.slice(0, 3).map(sub => {
                    const daysUntil = Math.ceil(
                      (new Date(sub.next_bill_date) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div key={sub.id} className="renewal-item">
                        <span className="renewal-name">{sub.name}</span>
                        <span className="renewal-days">{daysUntil} days</span>
                        <span className="renewal-price">${sub.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Card */}
        {subs.length > 0 && (
          <div className="insights-summary glass-effect">
            <div className="summary-header">
              <FiPieChart className="summary-icon" />
              <h3>Financial Health Summary</h3>
            </div>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Monthly Burn</span>
                <span className="summary-value">${totalMonthlyBurn.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Annual Projection</span>
                <span className="summary-value">${(totalMonthlyBurn * 12).toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Categories</span>
                <span className="summary-value">{new Set(subs.map(s => s.category)).size}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Avg. per Sub</span>
                <span className="summary-value">
                  ${(totalMonthlyBurn / subs.length).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InsightsPage