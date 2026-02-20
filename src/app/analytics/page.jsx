"use client"

import { useEffect, useState } from "react"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  FiTrendingDown,
  FiPieChart,
  FiDollarSign,
  FiCalendar,
  FiAlertCircle,
  FiTrendingUp
} from 'react-icons/fi';
import { createClient } from "@/utils/supabase/client";
import './analytics.css';

const AnalyticsPage = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);
        setSubs(data || [])
      }
      setLoading(false);
    }
    fetchStats()
  }, [supabase]);

  const categoryData = subs.reduce((acc, sub) => {
    const price = parseFloat(sub.price) || 0;

    let monthlyPrice = price;
    if (sub.billing_cycle === 'yearly') monthlyPrice = price / 12;
    if (sub.billing_cycle === 'weekly') monthlyPrice = price * 4.33;

    const existing = acc.find(item => item.name === sub.category);
    if (existing) {
      existing.value += monthlyPrice;
    } else {
      acc.push({ name: sub.category, value: monthlyPrice });
    }
    return acc;
  }, []).map(item => ({ ...item, value: parseFloat(item.value.toFixed(2)) }))

  const totalMonthlyBurn = categoryData.reduce((sum, item) => sum + item.value, 0)

  // Calculate additional insights
  const highestSub = subs.length > 0
    ? [...subs].sort((a, b) => b.price - a.price)[0]
    : null;

  const averageSubPrice = subs.length > 0
    ? (subs.reduce((sum, sub) => sum + parseFloat(sub.price), 0) / subs.length).toFixed(2)
    : 0;

  // Calculate top 5 percentage - FIXED THE ERROR HERE
  const topFivePercentage = subs.length > 0
    ? (
      (subs
        .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        .slice(0, 5)
        .reduce((sum, sub) => sum + parseFloat(sub.price), 0) /
        subs.reduce((sum, sub) => sum + parseFloat(sub.price), 0) * 100
      ).toFixed(0)
    )
    : 0;

  if (loading) {
    return (
      <div className="analytics-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Analyzing your spending...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-wrapper">
      {/* Animated Background */}
      <div className="analytics-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="analytics-container">
        {/* Header */}
        <header className="analytics-header">
          <div className="header-content">
            <h1 style={{ color: 'white' }}>Financial Insights</h1>
            <p className="header-subtitle">Breakdown of your digital footprint</p>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <span className="header-stat-label">Total Subscriptions</span>
              <span className="header-stat-value">{subs.length}</span>
            </div>
            <div className="header-stat">
              <span className="header-stat-label">Categories</span>
              <span className="header-stat-value">{categoryData.length}</span>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card glass-effect">
            <div className="metric-icon-wrapper">
              <FiDollarSign className="metric-icon" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Monthly Burn</span>
              <span className="metric-value">${totalMonthlyBurn.toFixed(2)}</span>
              <span className="metric-trend">
                <FiTrendingUp /> Projected annual: ${(totalMonthlyBurn * 12).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="metric-card glass-effect">
            <div className="metric-icon-wrapper">
              <FiTrendingUp className="metric-icon" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Highest Subscription</span>
              <span className="metric-value">
                {highestSub ? `$${parseFloat(highestSub.price).toFixed(2)}` : '$0'}
              </span>
              <span className="metric-trend">
                {highestSub?.name || 'No subscriptions'}
              </span>
            </div>
          </div>

          <div className="metric-card glass-effect">
            <div className="metric-icon-wrapper">
              <FiCalendar className="metric-icon" />
            </div>
            <div className="metric-content">
              <span className="metric-label">Average per Sub</span>
              <span className="metric-value">${averageSubPrice}</span>
              <span className="metric-trend">
                Across {subs.length} subscription{subs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Category Pie Chart */}
          <div className="chart-card glass-effect">
            <div className="chart-header">
              <FiPieChart className="chart-header-icon" />
              <h3 className="chart-title">Spend by Category</h3>
            </div>
            {categoryData.length > 0 ? (
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          className={`pie-cell-${index % 6}`}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-legend">
                  {categoryData.map((item, index) => (
                    <div key={item.name} className="legend-item">
                      <span className={`legend-color color-${index % 6}`} />
                      <span className="legend-name">{item.name}</span>
                      <span className="legend-value">${item.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="chart-empty">
                <p>No data to display</p>
              </div>
            )}
          </div>

          {/* Top Expenses List */}
          <div className="list-card glass-effect">
            <div className="list-header">
              <FiTrendingDown className="list-header-icon" />
              <h3 className="list-title">Top Expenses</h3>
              <span className="list-badge">Most expensive</span>
            </div>

            {subs.length > 0 ? (
              <div className="expenses-list">
                {[...subs]
                  .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                  .slice(0, 5)
                  .map((sub, index) => (
                    <div key={sub.id} className="expense-item">
                      <div className="expense-rank">#{index + 1}</div>
                      <div className="expense-info">
                        <span className="expense-name">{sub.name}</span>
                        <span className="expense-category">{sub.category}</span>
                      </div>
                      <div className="expense-price-wrapper">
                        <span className="expense-price">${parseFloat(sub.price).toFixed(2)}</span>
                        <span className="expense-period">/mo</span>
                      </div>
                    </div>
                  ))}

                {/* Additional insights - FIXED WITH THE VARIABLE */}
                <div className="expense-insight">
                  <FiAlertCircle className="insight-icon" />
                  <span className="insight-text">
                    Top 5 expenses account for {topFivePercentage}% of total
                  </span>
                </div>
              </div>
            ) : (
              <div className="list-empty">
                <p>No subscriptions yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        {categoryData.length > 0 && (
          <div className="bar-chart-card glass-effect">
            <div className="chart-header">
              <FiTrendingUp className="chart-header-icon" />
              <h3 className="chart-title">Monthly Spend by Category</h3>
            </div>
            <div className="bar-chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        className={`bar-cell-${index % 6}`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsPage