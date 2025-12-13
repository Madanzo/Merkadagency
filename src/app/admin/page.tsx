'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Analytics {
    overview: {
        totalLeads: number;
        newThisWeek: number;
        newThisMonth: number;
        conversionRate: number;
    };
    statusDistribution: Record<string, number>;
    formTypeDistribution: Record<string, number>;
}

const statusLabels: Record<string, string> = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    QUALIFIED: 'Qualified',
    PROPOSAL: 'Proposal',
    WON: 'Won',
    LOST: 'Lost',
};

const formTypeLabels: Record<string, string> = {
    CONTACT: 'Contact',
    NEWSLETTER: 'Newsletter',
    BOOKING: 'Booking',
    AUDIT: 'SEO Audit',
};

const statusColors: Record<string, string> = {
    NEW: '#3B82F6',
    CONTACTED: '#8B5CF6',
    QUALIFIED: '#F59E0B',
    PROPOSAL: '#EC4899',
    WON: '#10B981',
    LOST: '#EF4444',
};

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch('/api/admin/analytics');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setAnalytics(data);
            } catch (err) {
                setError('Failed to load analytics');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <Link href="/admin/leads" className="btn-primary">
                    View All Leads
                </Link>
            </div>

            {/* Overview Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{analytics?.overview.totalLeads || 0}</div>
                        <div className="stat-label">Total Leads</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{analytics?.overview.newThisWeek || 0}</div>
                        <div className="stat-label">New This Week</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon purple">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{analytics?.overview.newThisMonth || 0}</div>
                        <div className="stat-label">New This Month</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon yellow">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{analytics?.overview.conversionRate || 0}%</div>
                        <div className="stat-label">Conversion Rate</div>
                    </div>
                </div>
            </div>

            {/* Distribution Charts */}
            <div className="charts-grid">
                {/* Status Distribution */}
                <div className="chart-card">
                    <h3>Leads by Status</h3>
                    <div className="distribution-list">
                        {analytics?.statusDistribution && Object.entries(analytics.statusDistribution).map(([status, count]) => (
                            <div key={status} className="distribution-item">
                                <div className="distribution-label">
                                    <span
                                        className="status-dot"
                                        style={{ backgroundColor: statusColors[status] }}
                                    />
                                    {statusLabels[status] || status}
                                </div>
                                <div className="distribution-value">{count}</div>
                            </div>
                        ))}
                        {(!analytics?.statusDistribution || Object.keys(analytics.statusDistribution).length === 0) && (
                            <p className="empty-state">No leads yet</p>
                        )}
                    </div>
                </div>

                {/* Form Type Distribution */}
                <div className="chart-card">
                    <h3>Leads by Source</h3>
                    <div className="distribution-list">
                        {analytics?.formTypeDistribution && Object.entries(analytics.formTypeDistribution).map(([type, count]) => (
                            <div key={type} className="distribution-item">
                                <div className="distribution-label">
                                    {formTypeLabels[type] || type}
                                </div>
                                <div className="distribution-value">{count}</div>
                            </div>
                        ))}
                        {(!analytics?.formTypeDistribution || Object.keys(analytics.formTypeDistribution).length === 0) && (
                            <p className="empty-state">No leads yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <Link href="/admin/leads?status=NEW" className="action-card">
                        <div className="action-icon">🆕</div>
                        <span>View New Leads</span>
                    </Link>
                    <Link href="/admin/leads?formType=BOOKING" className="action-card">
                        <div className="action-icon">📅</div>
                        <span>Booking Requests</span>
                    </Link>
                    <Link href="/admin/leads?formType=AUDIT" className="action-card">
                        <div className="action-icon">🔍</div>
                        <span>Audit Requests</span>
                    </Link>
                    <a href="/" target="_blank" className="action-card">
                        <div className="action-icon">🌐</div>
                        <span>View Website</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
