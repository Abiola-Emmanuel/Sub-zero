"use client";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import Calendar from 'react-calendar';
import { createClient } from '@/utils/supabase/client';
import './calendar.css'
import { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css'; // Import base calendar styles

const CalendarPage = () => {
  const [subs, setSubs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const supabase = createClient();

  useEffect(() => {
    const fetchSubs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);
        setSubs(data || []);
      }
      setLoading(false);
    }
    fetchSubs();
  }, [supabase]);

  // Calculate monthly total
  const monthlyTotal = subs.reduce((sum, sub) => sum + Number(sub.price), 0);

  // Get upcoming payments for the next 7 days
  const getUpcomingPayments = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return subs.filter(sub => {
      const billDate = new Date(sub.next_bill_date);
      return billDate >= today && billDate <= nextWeek;
    }).sort((a, b) => new Date(a.next_bill_date) - new Date(b.next_bill_date));
  };

  // Function to check if a date has subscriptions
  const getSubsForDate = (date) => {
    return subs.filter(sub => {
      const billDate = new Date(sub.next_bill_date);
      return (
        billDate.getDate() === date.getDate() &&
        billDate.getMonth() === date.getMonth() &&
        billDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get total amount for a specific date
  const getTotalForDate = (date) => {
    const daySubs = getSubsForDate(date);
    return daySubs.reduce((acc, s) => acc + Number(s.price), 0);
  };

  // This function "injects" content into each calendar tile
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const daySubs = getSubsForDate(date);
      const dayTotal = getTotalForDate(date);

      if (daySubs.length > 0) {
        return (
          <div className="tile-content">
            <div className="tile-dots">
              {daySubs.slice(0, 3).map((sub, i) => (
                <div
                  key={i}
                  className="tile-dot"
                  style={{
                    backgroundColor: i === 0 ? '#00ff88' : i === 1 ? '#60a5fa' : '#fbbf24',
                    animationDelay: `${i * 0.1}s`
                  }}
                  title={sub.name}
                />
              ))}
              {daySubs.length > 3 && (
                <span className="tile-more">+{daySubs.length - 3}</span>
              )}
            </div>
            <span className="tile-total">
              ${dayTotal.toFixed(0)}
            </span>
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile classes
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const daySubs = getSubsForDate(date);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const hasSubs = daySubs.length > 0;

      let className = '';
      if (isSelected) className += ' selected-tile';
      if (hasSubs) className += ' has-subs';
      return className;
    }
    return '';
  };

  const upcomingPayments = getUpcomingPayments();

  if (loading) {
    return (
      <div className="calendar-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Syncing your payment schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-wrapper">
      {/* Animated Background */}
      <div className="calendar-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="calendar-page-container">
        {/* Header */}
        <header className="calendar-header">
          <div className="header-content">
            <h1 className="gradient-text">Payment Schedule</h1>
            <p className="header-subtitle">Never be surprised by a renewal again.</p>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <FiCalendar className="header-stat-icon" />
              <div className="header-stat-info">
                <span className="header-stat-label">Monthly Total</span>
                <span className="header-stat-value">${monthlyTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="calendar-main-layout">
          {/* Calendar Section */}
          <div className="calendar-section glass-effect">
            <div className="calendar-navigation">
              <button className="view-toggle">
                <span className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Month</span>
                <span className={view === 'year' ? 'active' : ''} onClick={() => setView('year')}>Year</span>
              </button>
            </div>

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              prevLabel={<FiChevronLeft />}
              nextLabel={<FiChevronRight />}
              prev2Label={null}
              next2Label={null}
              formatShortWeekday={(locale, date) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]}
              formatMonth={(locale, date) => date.toLocaleDateString('en-US', { month: 'short' })}
            />
          </div>

          {/* Sidebar */}
          <div className="calendar-sidebar">
            {/* Selected Date Details */}
            <div className="date-details-card glass-effect">
              <div className="date-header">
                <h3 className="date-title">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <span className="date-badge">
                  {getSubsForDate(selectedDate).length} payment{getSubsForDate(selectedDate).length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="selected-day-subs">
                {getSubsForDate(selectedDate).length > 0 ? (
                  <>
                    <div className="day-total-bar">
                      <span>Total due:</span>
                      <span className="day-total-amount">
                        ${getTotalForDate(selectedDate).toFixed(2)}
                      </span>
                    </div>
                    <div className="subs-list">
                      {getSubsForDate(selectedDate).map(sub => (
                        <div key={sub.id} className="sidebar-sub-card">
                          <div className="sub-info">
                            <span className="sub-name">{sub.name}</span>
                            <span className="sub-category">{sub.category}</span>
                          </div>
                          <span className="sub-price">${Number(sub.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="no-payments">
                    <FiCreditCard className="no-payments-icon" />
                    <p>No payments scheduled for this day.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Payments Preview */}
            {upcomingPayments.length > 0 && (
              <div className="upcoming-card glass-effect">
                <h4 className="upcoming-title">Next 7 Days</h4>
                <div className="upcoming-list">
                  {upcomingPayments.slice(0, 5).map(sub => {
                    const daysUntil = Math.ceil(
                      (new Date(sub.next_bill_date) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div key={sub.id} className="upcoming-item">
                        <div className="upcoming-info">
                          <span className="upcoming-name">{sub.name}</span>
                          <span className="upcoming-days">
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                          </span>
                        </div>
                        <span className="upcoming-price">${Number(sub.price).toFixed(2)}</span>
                      </div>
                    );
                  })}
                  {upcomingPayments.length > 5 && (
                    <div className="upcoming-more">
                      +{upcomingPayments.length - 5} more payments
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="quick-stats-card glass-effect">
              <h4 className="quick-stats-title">Quick Stats</h4>
              <div className="quick-stats-grid">
                <div className="quick-stat">
                  <span className="quick-stat-label">Active Subs</span>
                  <span className="quick-stat-value">{subs.length}</span>
                </div>
                <div className="quick-stat">
                  <span className="quick-stat-label">Avg. Payment</span>
                  <span className="quick-stat-value">
                    ${subs.length > 0 ? (monthlyTotal / subs.length).toFixed(2) : '0'}
                  </span>
                </div>
                <div className="quick-stat">
                  <span className="quick-stat-label">This Month</span>
                  <span className="quick-stat-value">${monthlyTotal.toFixed(2)}</span>
                </div>
                <div className="quick-stat">
                  <span className="quick-stat-label">Next 7 Days</span>
                  <span className="quick-stat-value">
                    ${upcomingPayments.reduce((sum, sub) => sum + Number(sub.price), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage;