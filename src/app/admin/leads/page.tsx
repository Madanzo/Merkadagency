'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Lead {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    company: string | null;
    formType: string;
    status: string;
    score: number;
    createdAt: string;
    _count: {
        notes: number;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const statusOptions = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];
const formTypeOptions = ['CONTACT', 'NEWSLETTER', 'BOOKING', 'AUDIT'];

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
    NEW: 'blue',
    CONTACTED: 'purple',
    QUALIFIED: 'yellow',
    PROPOSAL: 'pink',
    WON: 'green',
    LOST: 'red',
};

function LeadsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [status, setStatus] = useState(searchParams.get('status') || '');
    const [formType, setFormType] = useState(searchParams.get('formType') || '');

    const fetchLeads = useCallback(async () => {
        setIsLoading(true);
        const params = new URLSearchParams();

        const page = searchParams.get('page') || '1';
        params.set('page', page);

        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (formType) params.set('formType', formType);

        try {
            const res = await fetch(`/api/admin/leads?${params}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setLeads(data.leads);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [search, status, formType, searchParams]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    function updateFilters() {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (formType) params.set('formType', formType);
        router.push(`/admin/leads?${params}`);
    }

    function clearFilters() {
        setSearch('');
        setStatus('');
        setFormType('');
        router.push('/admin/leads');
    }

    async function deleteLead(id: string) {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        try {
            const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(leads.filter(l => l.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className="page-header">
                <h1>Leads</h1>
                <span className="lead-count">{pagination?.total || 0} total</span>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Search by email, name, or company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && updateFilters()}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setTimeout(updateFilters, 0);
                        }}
                        className="filter-select"
                    >
                        <option value="">All Statuses</option>
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <select
                        value={formType}
                        onChange={(e) => {
                            setFormType(e.target.value);
                            setTimeout(updateFilters, 0);
                        }}
                        className="filter-select"
                    >
                        <option value="">All Sources</option>
                        {formTypeOptions.map(t => (
                            <option key={t} value={t}>{formTypeLabels[t]}</option>
                        ))}
                    </select>
                </div>

                <button onClick={updateFilters} className="btn-primary">
                    Search
                </button>

                {(search || status || formType) && (
                    <button onClick={clearFilters} className="btn-secondary">
                        Clear
                    </button>
                )}
            </div>

            {/* Leads Table */}
            {isLoading ? (
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : leads.length === 0 ? (
                <div className="empty-state">
                    <p>No leads found</p>
                    {(search || status || formType) && (
                        <button onClick={clearFilters} className="btn-secondary">
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="leads-table-container">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Contact</th>
                                <th>Source</th>
                                <th>Status</th>
                                <th>Score</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead.id}>
                                    <td>
                                        <div className="lead-contact">
                                            <div className="lead-name">{lead.name || 'No name'}</div>
                                            <div className="lead-email">{lead.email}</div>
                                            {lead.company && (
                                                <div className="lead-company">{lead.company}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="form-type-badge">
                                            {formTypeLabels[lead.formType] || lead.formType}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${statusColors[lead.status]}`}>
                                            {statusLabels[lead.status] || lead.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="lead-score">{lead.score}</span>
                                    </td>
                                    <td>
                                        <span className="lead-date">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="lead-actions">
                                            <Link
                                                href={`/admin/leads/${lead.id}`}
                                                className="action-btn view"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => deleteLead(lead.id)}
                                                className="action-btn delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', String(pagination.page - 1));
                            router.push(`/admin/leads?${params}`);
                        }}
                        disabled={pagination.page <= 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', String(pagination.page + 1));
                            router.push(`/admin/leads?${params}`);
                        }}
                        disabled={pagination.page >= pagination.totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
}

function LeadsLoading() {
    return (
        <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading leads...</p>
        </div>
    );
}

export default function LeadsPage() {
    return (
        <div className="leads-page">
            <Suspense fallback={<LeadsLoading />}>
                <LeadsContent />
            </Suspense>
        </div>
    );
}
