"use client";

import { MdSubscriptions, MdAttachMoney, MdCategory, MdDateRange, MdLoop } from 'react-icons/md';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FiCalendar, FiTag, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import './add-sub.css';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AddSubscriptionPage() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const supabase = createClient();

  const addSubscription = async (e) => {
    e.preventDefault();
    setLoading(true)

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert('You must be logged in to add a subscription');
      router.push('/login')
      return;
    }

    const nextBill = new Date(startDate || new Date());

    if (billingCycle === 'monthly') {
      nextBill.setMonth(nextBill.getMonth() + 1)
    } else if (billingCycle === 'yearly') {
      nextBill.setFullYear(nextBill.getFullYear() + 1);
    } else if (billingCycle === 'weekly') {
      nextBill.setDate(nextBill.getDate() + 7);
    }




    const { error } = await supabase
      .from('subscriptions')
      .insert([{
        name: name,
        price: parseFloat(price) || 0,
        category: category,
        start_date: startDate,
        billing_cycle: billingCycle,
        next_bill_date: nextBill.toISOString(),
        notes: note,
        user_id: user.id,
        is_trial: false
      }]);

    if (error) {
      setLoading(false)
      console.error("Supabase Error:", error.message);
      alert("Error: " + error.message);
    } else {
      setLoading(false)
      router.push('/dashboard');
    }
  }

  return (
    <div className="add-sub-wrapper">
      {/* Animated Background */}
      <div className="add-sub-background">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="add-sub-container">
        <div className="add-sub-card glass-effect">
          {/* Header */}
          <div className="add-sub-header">
            <div className="header-icon-wrapper">
              <MdSubscriptions className="header-icon" />
            </div>
            <h1 className="gradient-text">Add New Subscription</h1>
            <p className="header-subtitle">Enter the details of your subscription below</p>
          </div>

          {/* Form */}
          <form onSubmit={addSubscription} className="add-sub-form">
            {/* Subscription Name */}
            <div className="form-group">
              <label className="form-label">
                <FiCreditCard className="label-icon" />
                Subscription Name
              </label>
              <div className="input-wrapper">
                <MdSubscriptions className="input-icon" />
                <input
                  name="name"
                  type="text"
                  placeholder="Netflix, Spotify, Disney+"
                  required
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}

                />
              </div>
              <span className="input-hint">e.g. Netflix, Spotify, Disney+</span>
            </div>

            {/* Monthly Price */}
            <div className="form-group">
              <label className="form-label">
                <FiDollarSign className="label-icon" />
                Monthly Price
              </label>
              <div className="input-wrapper">
                <MdAttachMoney className="input-icon" />
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="9.99"
                  required
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <span className="input-hint">Enter amount in your currency</span>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                <FiTag className="label-icon" />
                Category
              </label>
              <div className="input-wrapper">
                <MdCategory className="input-icon" />
                <input
                  name="category"
                  type="text"
                  placeholder="Entertainment"
                  required
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <span className="input-hint">e.g. Entertainment, Productivity, Fitness</span>
            </div>

            {/* Date and Billing Cycle Row */}
            <div className="form-row">
              {/* Start Date */}
              <div className="form-group half">
                <label className="form-label">
                  <FiCalendar className="label-icon" />
                  Start Date
                </label>
                <div className="input-wrapper">
                  <MdDateRange className="input-icon" />
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="form-input date-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Billing Cycle */}
              <div className="form-group half">
                <label className="form-label">
                  <MdLoop className="label-icon" />
                  Billing Cycle
                </label>
                <div className="input-wrapper">
                  <select name="billingCycle" value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)} required className="form-select">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Options (Optional) */}
            <div className="form-group">
              <label className="form-label">
                <FiTag className="label-icon" />
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                placeholder="Add any notes about this subscription..."
                className="form-textarea"
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              <IoAddCircleOutline className="button-icon" />
              {loading ? 'Adding Subscription...' : 'Add Subscription to Vault'}
            </button>
          </form>

          {/* Footer */}
          <div className="add-sub-footer">
            <p>Track all your subscriptions in one place</p>
            <div className="footer-stats">
              <span>💰 Save up to 30% on forgotten subscriptions</span>
            </div>
          </div>
        </div>

        {/* Quick Tips Sidebar */}
        <div className="quick-tips glass-effect">
          <h3 className="tips-title">💡 Quick Tips</h3>
          <ul className="tips-list">
            <li>Use the exact name as it appears on your bank statement</li>
            <li>Check your email for forgotten subscriptions</li>
            <li>Add all family streaming accounts to track total spend</li>
            <li>Set reminders for free trials ending soon</li>
          </ul>
          <div className="tips-stats">
            <div className="tips-stat">
              <span className="tips-stat-value">30%</span>
              <span className="tips-stat-label">Average savings</span>
            </div>
            <div className="tips-stat">
              <span className="tips-stat-value">$247</span>
              <span className="tips-stat-label">Avg monthly spend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}