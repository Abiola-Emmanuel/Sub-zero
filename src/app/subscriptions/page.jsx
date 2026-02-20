"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client";
import { FiFilter, FiSearch, FiPlus, FiGrid, FiList } from 'react-icons/fi';
import Link from "next/link";
import SubscriptionGrid from "@/components/SubscriptionGrid";
import './subscriptions.css';
import '../dashboard/dashboard.css'

const SubscriptionPage = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const supabase = createClient();

  useEffect(() => {
    const fetchSubs = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('name', { ascending: true });
        setSubs(data || []);
      }
      setLoading(false)
    }

    fetchSubs();
  }, [supabase])

  // Unique categories for the filter
  const categories = ['All', ...new Set(subs.map(s => s.category))];

  // Calculate category counts
  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat === 'All') {
      acc[cat] = subs.length;
    } else {
      acc[cat] = subs.filter(s => s.category === cat).length;
    }
    return acc;
  }, {});

  // Filter by both category and search
  const filteredSubs = subs
    .filter(s => activeCategory === 'All' ? true : s.category === activeCategory)
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this subscription?');
    if (!confirmed) return;
    const { error } = await supabase.from('subscriptions').delete().eq('id', id);
    if (!error) {
      setSubs(prev => prev.filter(s => s.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="subscriptions-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Opening your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscriptions-wrapper">
      {/* Animated Background */}
      <div className="subscriptions-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="subscriptions-container">
        {/* Header */}
        <header className="subscriptions-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="">Your Subscriptions</h1>
              <p className="header-subtitle">
                <span className="subtitle-count">{subs.length}</span> total services tracked
              </p>
            </div>
            <div className="header-actions">

              <Link href="/add-sub" className="add-button">
                <FiPlus className="add-button-icon" />
                <span>Add New</span>
              </Link>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="filter-section">


            {/* Category Chips */}
            <div className="filter-bar">
              <FiFilter className="filter-icon" />
              <div className="category-chips">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`chip ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    <span className="chip-name">{cat}</span>
                    <span className="chip-count">{categoryCounts[cat]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            Showing <span className="highlight">{filteredSubs.length}</span> of{' '}
            <span className="highlight">{subs.length}</span> subscriptions
          </p>
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          )}
        </div>

        {/* Subscriptions Grid/List */}
        <main className={`subscriptions-content ${viewMode}-view`}>
          {filteredSubs.length > 0 ? (
            <SubscriptionGrid
              initialSubs={filteredSubs}
              onDelete={handleDelete}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-state-content">
                {searchQuery ? (
                  <>
                    <p>No subscriptions found matching &quot;{searchQuery}&quot;</p>
                    <button
                      className="secondary-button"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </button>
                  </>
                ) : activeCategory !== 'All' ? (
                  <>
                    <p>No subscriptions in &quot;{activeCategory}&quot; category</p>
                    <button
                      className="secondary-button"
                      onClick={() => setActiveCategory('All')}
                    >
                      View all
                    </button>
                  </>
                ) : (
                  <>
                    <p>Your vault is empty</p>
                    <Link href="/add-sub" className="primary-button">
                      <FiPlus /> Add your first subscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Quick Stats Footer */}
        {subs.length > 0 && (
          <footer className="subscriptions-footer">
            <div className="footer-stat">
              <span className="footer-stat-label">Total Monthly</span>
              <span className="footer-stat-value">
                ${subs.reduce((sum, sub) => sum + parseFloat(sub.price), 0).toFixed(2)}
              </span>
            </div>
            <div className="footer-stat">
              <span className="footer-stat-label">Categories</span>
              <span className="footer-stat-value">{categories.length - 1}</span>
            </div>
            <div className="footer-stat">
              <span className="footer-stat-label">Most Expensive</span>
              <span className="footer-stat-value">
                ${Math.max(...subs.map(s => parseFloat(s.price))).toFixed(2)}
              </span>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}

export default SubscriptionPage