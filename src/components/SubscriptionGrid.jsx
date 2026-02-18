"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';
const SubscriptionGrid = ({ initialSubs, onDelete }) => {

  const [query, setQuery] = useState("");

  const supabase = createClient();

  const filteredSubs = initialSubs.filter((sub) => sub.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      {/* 1. The Search Input */}
      <div className="search-bar-wrapper" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search subscriptions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          style={{
            width: '100%',
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid #333',
            borderRadius: '12px',
            color: '#fff',
            outline: 'none'
          }}
        />
      </div>

      {/* 2. The Grid */}
      <div className="subscriptions-grid">
        {filteredSubs.length > 0 ? (
          filteredSubs.map((sub) => (
            <div key={sub.id} className="subscription-card">
              <div className="card-header">
                <div className="card-title-wrapper">
                  <h3 className="subscription-name">{sub.name}</h3>
                  <span className="subscription-category">{sub.category}</span>
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => onDelete(sub.id)}
                    className="action-icon delete"
                  >
                    <FiTrash2 />
                  </button>
                  <Link href={`/edit-sub/${sub.id}`} className="edit-button"><FiEdit2 /></Link>
                  {/* <span className="cycle-badge">{sub.billing_cycle}</span> */}
                </div>
              </div>

              <div className="card-details">
                <div className="price-section">
                  <span className="price-amount">${Number(sub.price).toFixed(2)}</span>
                  <span className="price-period">/month</span>
                </div>
                <div className="renewal-info">
                  <span className="renewal-label">Next renewal</span>
                  <span className="renewal-date">
                    {new Date(sub.next_bill_date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No subscriptions found matching &quot;{query}&quot;</p>
          </div>
        )}
      </div>
    </>
  )
}

export default SubscriptionGrid
