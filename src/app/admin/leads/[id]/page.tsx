'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Note {
    id: string;
    content: string;
    createdAt: string;
    author: {
        name: string | null;
        email: string;
    } | null;
}

interface Lead {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    company: string | null;
    website: string | null;
    formType: string;
    service: string | null;
    budget: string | null;
    message: string | null;
    goals: string | null;
    status: string;
    score: number;
    tags: string[];
    source: string | null;
    medium: string | null;
    campaign: string | null;
    createdAt: string;
    updatedAt: string;
    notes: Note[];
}

const statusOptions = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];

const statusLabels: Record<string, string> = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    QUALIFIED: 'Qualified',
    PROPOSAL: 'Proposal',
    WON: 'Won',
    LOST: 'Lost',
};

const formTypeLabels: Record<string, string> = {
    CONTACT: 'Contact Form',
    NEWSLETTER: 'Newsletter Signup',
    BOOKING: 'Booking Request',
    AUDIT: 'SEO Audit Request',
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [lead, setLead] = useState<Lead | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        async function fetchLead() {
            try {
                const res = await fetch(`/api/admin/leads/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setLead(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLead();
    }, [id]);

    async function updateLead(updates: Partial<Lead>) {
        if (!lead) return;
        setIsSaving(true);

        try {
            const res = await fetch(`/api/admin/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (res.ok) {
                const updated = await res.json();
                setLead({ ...lead, ...updated });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    }

    async function addNote() {
        if (!newNote.trim() || !lead) return;

        try {
            const res = await fetch('/api/admin/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: id, content: newNote }),
            });

            if (res.ok) {
                const note = await res.json();
                setLead({ ...lead, notes: [note, ...lead.notes] });
                setNewNote('');
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function addTag() {
        if (!newTag.trim() || !lead) return;
        const updatedTags = [...lead.tags, newTag.trim()];
        await updateLead({ tags: updatedTags } as Partial<Lead>);
        setNewTag('');
    }

    async function removeTag(tagToRemove: string) {
        if (!lead) return;
        const updatedTags = lead.tags.filter(t => t !== tagToRemove);
        await updateLead({ tags: updatedTags } as Partial<Lead>);
    }

    async function deleteLead() {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        try {
            const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/admin/leads');
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading lead...</p>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="admin-error">
                <p>Lead not found</p>
                <Link href="/admin/leads" className="btn-primary">
                    Back to Leads
                </Link>
            </div>
        );
    }

    return (
        <div className="lead-detail">
            {/* Header */}
            <div className="lead-header">
                <Link href="/admin/leads" className="back-link">
                    ← Back to Leads
                </Link>
                <div className="lead-title-row">
                    <div>
                        <h1>{lead.name || lead.email}</h1>
                        <p className="lead-subtitle">{lead.email}</p>
                    </div>
                    <div className="lead-header-actions">
                        {lead.email && (
                            <a href={`mailto:${lead.email}`} className="btn-primary">
                                Send Email
                            </a>
                        )}
                        <button onClick={deleteLead} className="btn-danger">
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <div className="lead-content">
                {/* Left Column - Main Info */}
                <div className="lead-main">
                    {/* Status & Score */}
                    <div className="info-card">
                        <h3>Status & Score</h3>
                        <div className="status-score-row">
                            <div className="field-group">
                                <label>Status</label>
                                <select
                                    value={lead.status}
                                    onChange={(e) => updateLead({ status: e.target.value } as Partial<Lead>)}
                                    disabled={isSaving}
                                    className="status-select"
                                >
                                    {statusOptions.map(s => (
                                        <option key={s} value={s}>{statusLabels[s]}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field-group">
                                <label>Score (0-100)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={lead.score}
                                    onChange={(e) => updateLead({ score: parseInt(e.target.value) || 0 })}
                                    disabled={isSaving}
                                    className="score-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="info-card">
                        <h3>Contact Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Email</label>
                                <a href={`mailto:${lead.email}`}>{lead.email}</a>
                            </div>
                            {lead.phone && (
                                <div className="info-item">
                                    <label>Phone</label>
                                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                                </div>
                            )}
                            {lead.company && (
                                <div className="info-item">
                                    <label>Company</label>
                                    <span>{lead.company}</span>
                                </div>
                            )}
                            {lead.website && (
                                <div className="info-item">
                                    <label>Website</label>
                                    <a href={lead.website} target="_blank" rel="noopener noreferrer">
                                        {lead.website}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Details */}
                    <div className="info-card">
                        <h3>Form Details</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Source</label>
                                <span>{formTypeLabels[lead.formType] || lead.formType}</span>
                            </div>
                            {lead.service && (
                                <div className="info-item">
                                    <label>Service Interest</label>
                                    <span>{lead.service}</span>
                                </div>
                            )}
                            {lead.budget && (
                                <div className="info-item">
                                    <label>Budget</label>
                                    <span>{lead.budget}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <label>Submitted</label>
                                <span>{new Date(lead.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                        {(lead.message || lead.goals) && (
                            <div className="info-item full-width">
                                <label>{lead.goals ? 'Goals' : 'Message'}</label>
                                <p className="lead-message">{lead.goals || lead.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="info-card">
                        <h3>Tags</h3>
                        <div className="tags-container">
                            {lead.tags.map(tag => (
                                <span key={tag} className="tag">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="tag-remove">×</button>
                                </span>
                            ))}
                            <div className="add-tag">
                                <input
                                    type="text"
                                    placeholder="Add tag..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                />
                                <button onClick={addTag} disabled={!newTag.trim()}>+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Notes */}
                <div className="lead-sidebar">
                    <div className="info-card notes-card">
                        <h3>Activity Notes</h3>

                        {/* Add Note Form */}
                        <div className="add-note">
                            <textarea
                                placeholder="Add a note..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={3}
                            />
                            <button
                                onClick={addNote}
                                disabled={!newNote.trim()}
                                className="btn-primary"
                            >
                                Add Note
                            </button>
                        </div>

                        {/* Notes Timeline */}
                        <div className="notes-timeline">
                            {lead.notes.length === 0 ? (
                                <p className="empty-notes">No notes yet</p>
                            ) : (
                                lead.notes.map(note => (
                                    <div key={note.id} className="note-item">
                                        <div className="note-header">
                                            <span className="note-author">
                                                {note.author?.name || note.author?.email || 'System'}
                                            </span>
                                            <span className="note-date">
                                                {new Date(note.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="note-content">{note.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
