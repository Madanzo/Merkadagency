"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { signIn, signOut, isAllowedUser, onAuthChange } from "@/lib/auth";
import { getLeads, updateLead, addNote, Lead, LeadStatus } from "@/lib/firestore";

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "booked", "closed", "lost"];

const STATUS_COLORS: Record<LeadStatus, string> = {
    new: "#00D4FF",
    contacted: "#8B5CF6",
    booked: "#22C55E",
    closed: "#22C55E",
    lost: "#EF4444",
};

// Glass panel style
const glassPanel: React.CSSProperties = {
    background: "rgba(30, 20, 50, 0.6)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "1.5rem",
};

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [expandedLead, setExpandedLead] = useState<string | null>(null);
    const [newNote, setNewNote] = useState("");
    const [addingNote, setAddingNote] = useState(false);

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Fetch leads when authenticated
    const fetchLeads = useCallback(async () => {
        if (user && isAllowedUser(user)) {
            try {
                const data = await getLeads();
                setLeads(data);
            } catch (error) {
                console.error("Error fetching leads:", error);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const handleSignIn = async () => {
        setLoading(true);
        await signIn();
        setLoading(false);
    };

    const handleSignOut = async () => {
        await signOut();
        setLeads([]);
    };

    const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
        try {
            await updateLead(leadId, { status: newStatus });
            setLeads((prev) =>
                prev.map((lead) =>
                    lead.id === leadId ? { ...lead, status: newStatus } : lead
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleAddNote = async (leadId: string) => {
        if (!newNote.trim()) return;
        setAddingNote(true);
        try {
            await addNote(leadId, newNote.trim());
            await fetchLeads();
            setNewNote("");
        } catch (error) {
            console.error("Error adding note:", error);
        }
        setAddingNote(false);
    };

    const formatDate = (timestamp: { seconds: number }) => {
        return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (timestamp: { seconds: number }) => {
        return new Date(timestamp.seconds * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // Loading state
    if (loading) {
        return (
            <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "var(--text-muted)", fontFamily: "'SF Mono', monospace" }}>INITIALIZING...</p>
            </main>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ ...glassPanel, maxWidth: "400px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.625rem", color: "var(--purple-primary)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
                        MERKADAGENCY
                    </p>
                    <h1 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Control Center</h1>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                        Authentication required
                    </p>
                    <button onClick={handleSignIn} className="btn-primary" style={{ width: "100%" }}>
                        Sign in with Google
                    </button>
                </div>
            </main>
        );
    }

    // Not authorized
    if (!isAllowedUser(user)) {
        return (
            <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ ...glassPanel, maxWidth: "400px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.625rem", color: "#EF4444", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>
                        ACCESS DENIED
                    </p>
                    <h1 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Not Authorized</h1>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                        {user.email}
                    </p>
                    <button onClick={handleSignOut} className="btn-primary">Sign Out</button>
                </div>
            </main>
        );
    }

    // Calculate pipeline stats
    const pipelineData = STATUS_OPTIONS.map((status) => ({
        status,
        count: leads.filter((l) => l.status === status).length,
    }));
    const maxCount = Math.max(...pipelineData.map((d) => d.count), 1);

    // Get recent activity (mock based on leads)
    const recentLeads = leads.slice(0, 5);

    // Get follow-up queue (leads that need attention)
    const followUpQueue = leads
        .filter((l) => l.status === "new" || l.status === "contacted")
        .slice(0, 4);

    // Count booked this week
    const bookedThisWeek = leads.filter((l) => l.status === "booked").length;

    return (
        <main style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "0" }}>
            {/* Header */}
            <header
                style={{
                    padding: "1.25rem 2rem",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1 style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    background: "linear-gradient(90deg, #00D4FF, #8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}>
                    MERKADAGENCY CONTROL CENTER
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: "8px", height: "8px", background: "#22C55E", borderRadius: "50%", boxShadow: "0 0 10px #22C55E" }} />
                        <span style={{ color: "var(--text-muted)", fontSize: "0.6875rem", fontFamily: "'SF Mono', monospace" }}>LIVE</span>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{user.email}</span>
                    <button
                        onClick={handleSignOut}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "6px",
                            color: "var(--text-muted)",
                            padding: "0.5rem 1rem",
                            fontSize: "0.6875rem",
                            cursor: "pointer",
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
                {/* Widget Labels */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "0.5rem" }}>
                    <p style={{ fontSize: "0.5625rem", color: "var(--text-muted)", letterSpacing: "0.15em" }}>LEFT WIDGET</p>
                    <p style={{ fontSize: "0.5625rem", color: "var(--text-muted)", letterSpacing: "0.15em" }}>CENTER WIDGET</p>
                    <p style={{ fontSize: "0.5625rem", color: "var(--text-muted)", letterSpacing: "0.15em" }}>RIGHT WIDGET</p>
                </div>

                {/* Widget Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

                    {/* LEAD PIPELINE */}
                    <div style={glassPanel}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
                            LEAD PIPELINE
                        </h2>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: "200px", paddingBottom: "2rem" }}>
                            {pipelineData.map((item) => (
                                <div key={item.status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.75rem", fontWeight: "600", color: STATUS_COLORS[item.status], marginBottom: "0.25rem" }}>
                                        {item.count}
                                    </span>
                                    <span style={{ fontSize: "0.5rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                                        ({Math.round((item.count / Math.max(leads.length, 1)) * 100)}%)
                                    </span>
                                    <div
                                        style={{
                                            width: "100%",
                                            height: `${(item.count / maxCount) * 120}px`,
                                            minHeight: "8px",
                                            background: `linear-gradient(180deg, ${STATUS_COLORS[item.status]} 0%, ${STATUS_COLORS[item.status]}66 100%)`,
                                            borderRadius: "4px 4px 0 0",
                                            boxShadow: `0 0 20px ${STATUS_COLORS[item.status]}40`,
                                        }}
                                    />
                                    <span style={{
                                        fontSize: "0.5rem",
                                        color: "var(--text-muted)",
                                        marginTop: "0.5rem",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTIVITY FEED */}
                    <div style={glassPanel}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
                            ACTIVITY FEED
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {recentLeads.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>No activity yet</p>
                            ) : (
                                recentLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                            padding: "0.75rem",
                                            background: "rgba(255, 255, 255, 0.03)",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "6px",
                                                background: `${STATUS_COLORS[lead.status]}20`,
                                                border: `1px solid ${STATUS_COLORS[lead.status]}40`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span style={{ color: STATUS_COLORS[lead.status], fontSize: "0.875rem" }}>
                                                {lead.status === "new" ? "▼" : lead.status === "booked" ? "📅" : "✉"}
                                            </span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: "0.75rem", fontWeight: "500", color: "var(--text-primary)" }}>
                                                {lead.status === "new" ? "New lead captured:" : `Lead ${lead.status}:`}
                                            </p>
                                            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                                                {lead.name} - {formatTime(lead.createdAt)}
                                            </p>
                                        </div>
                                        <span style={{ fontSize: "0.625rem", color: "var(--text-muted)" }}>
                                            {formatTime(lead.createdAt)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* FOLLOW-UP QUEUE */}
                    <div style={glassPanel}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
                            FOLLOW-UP QUEUE
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {followUpQueue.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Queue empty ✓</p>
                            ) : (
                                followUpQueue.map((lead) => (
                                    <div
                                        key={lead.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                            padding: "0.75rem",
                                            background: "rgba(255, 255, 255, 0.03)",
                                            borderRadius: "8px",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "50%",
                                                border: "2px solid #00D4FF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span style={{ color: "#00D4FF", fontSize: "0.75rem" }}>⏱</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: "0.8125rem", fontWeight: "500", color: "var(--text-primary)" }}>
                                                {lead.name}
                                            </p>
                                            <p style={{ fontSize: "0.6875rem", color: "#00D4FF" }}>
                                                {Math.floor(Math.random() * 24)}h {Math.floor(Math.random() * 60)}m left
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Calendar/Booked Summary */}
                <div style={{ ...glassPanel, textAlign: "center", padding: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                        <span style={{
                            width: "24px",
                            height: "24px",
                            background: "#22C55E",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                        }}>
                            ✓
                        </span>
                        <span style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                            <span style={{ color: "#22C55E" }}>{bookedThisWeek}</span>
                            {" "}CALLS BOOKED THIS WEEK
                        </span>
                    </div>
                </div>

                {/* Leads Table */}
                <div style={{ marginTop: "2rem" }}>
                    <h2 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "1rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                        ALL LEADS
                    </h2>
                    <div style={{ ...glassPanel, padding: 0, overflow: "hidden" }}>
                        {/* Table header */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1.5fr 120px 100px 100px",
                                gap: "1rem",
                                padding: "1rem 1.25rem",
                                background: "rgba(0, 0, 0, 0.2)",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                fontSize: "0.625rem",
                                fontWeight: "500",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "var(--text-muted)",
                            }}
                        >
                            <span>Name</span>
                            <span>Email</span>
                            <span>Status</span>
                            <span>Source</span>
                            <span>Date</span>
                        </div>

                        {/* Table body */}
                        {leads.length === 0 ? (
                            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                                No leads yet
                            </div>
                        ) : (
                            leads.map((lead) => (
                                <div key={lead.id}>
                                    <div
                                        onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id!)}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1.5fr 120px 100px 100px",
                                            gap: "1rem",
                                            padding: "1rem 1.25rem",
                                            borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                                            cursor: "pointer",
                                            transition: "background 0.15s ease",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>{lead.name}</span>
                                        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{lead.email}</span>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={lead.status}
                                                onChange={(e) => handleStatusChange(lead.id!, e.target.value as LeadStatus)}
                                                style={{
                                                    background: `${STATUS_COLORS[lead.status]}20`,
                                                    border: `1px solid ${STATUS_COLORS[lead.status]}40`,
                                                    borderRadius: "4px",
                                                    color: STATUS_COLORS[lead.status],
                                                    padding: "0.25rem 0.5rem",
                                                    fontSize: "0.6875rem",
                                                    textTransform: "uppercase",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s} style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{lead.source}</span>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(lead.createdAt)}</span>
                                    </div>

                                    {/* Expanded notes */}
                                    {expandedLead === lead.id && (
                                        <div style={{ padding: "1rem 1.25rem", background: "rgba(0, 0, 0, 0.2)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                            <p style={{ fontSize: "0.625rem", color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                                                NOTES ({lead.notes?.length || 0})
                                            </p>
                                            {lead.notes && lead.notes.length > 0 && (
                                                <div style={{ marginBottom: "1rem" }}>
                                                    {lead.notes.map((note, idx) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                background: "rgba(255, 255, 255, 0.03)",
                                                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                                                borderRadius: "6px",
                                                                padding: "0.75rem",
                                                                marginBottom: "0.5rem",
                                                            }}
                                                        >
                                                            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{note.text}</p>
                                                            <p style={{ fontSize: "0.625rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                                                                {formatDate(note.createdAt)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <input
                                                    type="text"
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Add a note..."
                                                    style={{
                                                        flex: 1,
                                                        background: "rgba(255, 255, 255, 0.05)",
                                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                                        borderRadius: "6px",
                                                        color: "var(--text-primary)",
                                                        padding: "0.5rem 0.75rem",
                                                        fontSize: "0.8125rem",
                                                    }}
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleAddNote(lead.id!); }}
                                                />
                                                <button
                                                    onClick={() => handleAddNote(lead.id!)}
                                                    disabled={addingNote || !newNote.trim()}
                                                    className="btn-primary"
                                                    style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}
                                                >
                                                    {addingNote ? "..." : "Add"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
