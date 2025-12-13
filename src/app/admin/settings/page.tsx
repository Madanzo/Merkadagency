'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [message, setMessage] = useState('');

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>Settings</h1>
            </div>

            {message && (
                <div className="success-message">{message}</div>
            )}

            {/* Email Settings */}
            <div className="settings-card">
                <h3>Email Notifications</h3>
                <p className="settings-description">
                    Configure email notifications for new form submissions.
                </p>

                <div className="settings-item">
                    <div className="setting-info">
                        <label>Notification Email</label>
                        <p>Set via NOTIFICATION_EMAIL environment variable</p>
                    </div>
                    <span className="setting-value">
                        {process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL || 'info@merkadagency.com'}
                    </span>
                </div>

                <div className="settings-item">
                    <div className="setting-info">
                        <label>Email Service</label>
                        <p>Set via RESEND_API_KEY environment variable</p>
                    </div>
                    <span className="setting-value status-badge green">
                        Resend
                    </span>
                </div>
            </div>

            {/* Database Info */}
            <div className="settings-card">
                <h3>Database</h3>
                <p className="settings-description">
                    Database connection information.
                </p>

                <div className="settings-item">
                    <div className="setting-info">
                        <label>Provider</label>
                        <p>PostgreSQL (Vercel Postgres)</p>
                    </div>
                    <span className="setting-value status-badge blue">
                        Connected
                    </span>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-card danger-zone">
                <h3>Danger Zone</h3>
                <p className="settings-description">
                    Irreversible actions. Be careful!
                </p>

                <div className="settings-item">
                    <div className="setting-info">
                        <label>Delete All Leads</label>
                        <p>This will permanently delete all leads from the database.</p>
                    </div>
                    <button
                        className="btn-danger"
                        onClick={() => alert('This feature is disabled in the UI for safety. Use database tools directly.')}
                    >
                        Delete All
                    </button>
                </div>
            </div>

            {/* Environment Info */}
            <div className="settings-card">
                <h3>Environment</h3>
                <div className="env-info">
                    <code>
                        NODE_ENV: {process.env.NODE_ENV || 'development'}
                    </code>
                </div>
            </div>
        </div>
    );
}
