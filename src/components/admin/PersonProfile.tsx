import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Mail,
    Phone,
    Globe,
    Building2,
    Calendar,
    Trash2,
    ScrollText,
    FileText,
    Eye,
    Download,
    Brain,
    Clock,
    StickyNote,
    Send,
    PlusCircle,
    UserCheck,
    AlertTriangle,
    Calculator,
    X,
    CheckCircle,
    Edit2,
    RefreshCw,
    Loader2,
} from 'lucide-react';
import {
    getTimeline,
    getNotes,
    addNote,
    generateAISummary,
    convertLeadToClient,
    STATUS_CONFIG,
    type Person,
    type TimelineEvent,
    type PersonNote,
    type AISummary,
} from '@/lib/peopleService';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getClientQuotes, type SavedQuote } from '@/lib/quotes';
import { getClientContracts, type Contract, type ContractStatus } from '@/lib/contracts';
import { getClient, deleteClient } from '@/lib/clients';
import { generateContractPDF } from '@/lib/pricing/generateContract';
import { ContractDrawer } from './ContractDrawer';
import { PricingCalculator } from '@/components/admin/pricing/PricingCalculator';
import type { ClientProfile } from '@/lib/clients';

// ============ HELPERS ============

const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

const formatDate = (timestamp: any): string => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (timestamp: any): string => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });
};

// ============ STATUS BADGE COLORS ============

const quoteStatusColors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    sent: 'bg-blue-500/20 text-blue-400',
    accepted: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
};

const contractStatusColors: Record<ContractStatus, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    sent: 'bg-blue-500/20 text-blue-400',
    signed: 'bg-green-500/20 text-green-400',
    declined: 'bg-orange-500/20 text-orange-400',
    cancelled: 'bg-red-500/20 text-red-400',
};

// ============ TIMELINE EVENT ICONS ============

const timelineIcons: Record<string, { icon: typeof Clock; color: string }> = {
    form_submitted: { icon: FileText, color: 'text-blue-400' },
    quote_created: { icon: FileText, color: 'text-purple-400' },
    quote_sent: { icon: Send, color: 'text-blue-400' },
    quote_accepted: { icon: CheckCircle, color: 'text-green-400' },
    quote_rejected: { icon: AlertTriangle, color: 'text-red-400' },
    contract_generated: { icon: ScrollText, color: 'text-purple-400' },
    contract_sent: { icon: Send, color: 'text-blue-400' },
    contract_signed: { icon: CheckCircle, color: 'text-green-400' },
    contract_declined: { icon: AlertTriangle, color: 'text-orange-400' },
    note_added: { icon: StickyNote, color: 'text-yellow-400' },
    status_changed: { icon: Edit2, color: 'text-gray-400' },
    converted_from_lead: { icon: UserCheck, color: 'text-green-400' },
    email_sent: { icon: Mail, color: 'text-blue-400' },
};

// ============ PROPS ============

interface PersonProfileProps {
    person: Person;
    onBack: () => void;
    onRefresh: () => void;
}

// ============ MAIN COMPONENT ============

export function PersonProfile({ person, onBack, onRefresh }: PersonProfileProps) {
    const [quotes, setQuotes] = useState<SavedQuote[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [notes, setNotes] = useState<PersonNote[]>([]);
    const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
    const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [addingNote, setAddingNote] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [quoteDrawerOpen, setQuoteDrawerOpen] = useState(false);
    const [previewContract, setPreviewContract] = useState<Contract | undefined>(undefined);
    const [converting, setConverting] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState(false);

    const clientId = person.clientId || person.id;
    const isLeadOnly = person.type === 'lead' && !person.clientId;

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            if (!isLeadOnly) {
                const [q, c, t, n, cp] = await Promise.all([
                    getClientQuotes(clientId),
                    getClientContracts(clientId),
                    getTimeline(clientId),
                    getNotes(clientId),
                    getClient(clientId),
                ]);
                setQuotes(q);
                setContracts(c);
                setTimeline(t);
                setNotes(n);
                setClientProfile(cp);
                // Use rule-based as immediate fallback
                setAiSummary(generateAISummary(person, q, c, t));
                // Then try AI-powered summary (cached 1hr)
                loadAISummary(q, c, t);
            } else {
                setAiSummary(generateAISummary(person, [], [], []));
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to load profile data');
        } finally { setLoading(false); }
    }, [clientId, isLeadOnly, person]);

    // AI-powered summary via Cloud Function (with 1-hour cache)
    const AI_SUMMARY_CACHE: Record<string, { data: AISummary; timestamp: number }> = {};

    const loadAISummary = useCallback(async (q?: any[], c?: any[], t?: any[], forceRefresh = false) => {
        const cacheKey = `summary_${person.id}`;
        const cached = AI_SUMMARY_CACHE[cacheKey];
        if (!forceRefresh && cached && Date.now() - cached.timestamp < 3600000) {
            setAiSummary(cached.data);
            return;
        }

        setSummaryLoading(true);
        setSummaryError(false);
        try {
            const functions = getFunctions();
            const generateSummary = httpsCallable(functions, 'generateClientSummary');

            const lastActivity = person.lastActivity?.toDate?.() || new Date();
            const daysSinceActivity = Math.floor((Date.now() - lastActivity.getTime()) / 86400000);

            const result = await generateSummary({
                personName: person.name,
                personType: person.type,
                personStatus: person.status,
                timeline: (t || timeline).slice(0, 10).map((e: any) => ({
                    type: e.type, description: e.description,
                })),
                quotes: (q || quotes).slice(0, 5).map((qItem: any) => ({
                    quoteNumber: qItem.quoteNumber, status: qItem.status,
                    total: qItem.quote?.finalOneTimeTotal || 0,
                })),
                contracts: (c || contracts).slice(0, 5).map((cItem: any) => ({
                    contractNumber: cItem.contractNumber, status: cItem.status,
                    total: cItem.finalOneTimeTotal || 0,
                })),
                daysSinceActivity,
            });

            const summary = result.data as AISummary;
            // Map Cloud Function response fields to AISummary interface
            const mappedSummary: AISummary = {
                insight: (summary as any).summary || summary.insight || '',
                urgency: summary.urgency || 'low',
                suggestedAction: (summary as any).nextAction || summary.suggestedAction || '',
            };
            setAiSummary(mappedSummary);
            AI_SUMMARY_CACHE[cacheKey] = { data: mappedSummary, timestamp: Date.now() };
        } catch (err) {
            console.error('AI summary failed, using rule-based:', err);
            setSummaryError(true);
            // Keep the rule-based fallback
        } finally {
            setSummaryLoading(false);
        }
    }, [person, timeline, quotes, contracts]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleAddNote = async () => {
        if (!newNote.trim() || isLeadOnly) return;
        setAddingNote(true);
        try {
            await addNote(clientId, newNote.trim());
            setNewNote('');
            toast.success('Note added');
            loadData();
        } catch { toast.error('Failed to add note'); }
        finally { setAddingNote(false); }
    };

    const handleConvert = async () => {
        if (converting) return;
        setConverting(true);
        try {
            const { getLeads } = await import('@/lib/firestore');
            const leads = await getLeads();
            const lead = leads.find(l => l.id === person.leadId || l.id === person.id);
            if (!lead) { toast.error('Lead not found'); return; }

            const newClientId = await convertLeadToClient(lead);
            toast.success('Converted to client!');
            onRefresh();
            onBack();
        } catch { toast.error('Conversion failed'); }
        finally { setConverting(false); }
    };

    const handleDeletePerson = async () => {
        if (isLeadOnly) {
            toast.error('Cannot delete leads from here — use Pipeline.');
            return;
        }
        if (!confirm(`Delete "${person.name}"? This cannot be undone.`)) return;
        try {
            await deleteClient(clientId);
            toast.success('Deleted');
            onBack();
            onRefresh();
        } catch { toast.error('Failed to delete'); }
    };

    const statusConf = STATUS_CONFIG[person.status] || STATUS_CONFIG.new;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-merkad-text-muted hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to People
                </Button>
                {!isLeadOnly && (
                    <Button variant="ghost" onClick={handleDeletePerson} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                )}
            </div>

            {/* Contract Drawer */}
            {clientProfile && (
                <ContractDrawer
                    open={drawerOpen}
                    onClose={() => { setDrawerOpen(false); setPreviewContract(undefined); }}
                    onContractCreated={() => loadData()}
                    client={clientProfile}
                    leadId={person.leadId}
                    existingContract={previewContract}
                />
            )}

            {/* Quote Drawer / Modal */}
            {quoteDrawerOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={() => setQuoteDrawerOpen(false)} />
                    <div className="fixed inset-4 md:inset-10 lg:inset-x-20 xl:inset-x-32 bg-merkad-bg z-[70] rounded-xl shadow-2xl flex flex-col border border-merkad-border overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-merkad-border shrink-0 bg-merkad-bg-secondary">
                            <div>
                                <h2 className="text-xl font-bold text-white">Create Quote</h2>
                                <p className="text-xs text-merkad-text-muted mt-0.5">Pre-filled with {person.name}'s details</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setQuoteDrawerOpen(false)} className="text-merkad-text-muted hover:text-white">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-merkad-bg">
                            <PricingCalculator
                                initialClient={{
                                    id: clientProfile?.id || person.id,
                                    name: person.name,
                                    email: person.email || '',
                                    phone: person.phone || '',
                                    business: person.business || '',
                                    website: person.website || ''
                                }}
                                onClose={() => {
                                    setQuoteDrawerOpen(false);
                                    loadData();
                                }}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* ===== HEADER ===== */}
            <Card className="bg-merkad-bg-secondary border-merkad-border">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full bg-merkad-purple/20 flex items-center justify-center shrink-0">
                            <span className="text-xl font-bold text-merkad-purple">
                                {(person.name || '?').charAt(0).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-2xl font-bold text-white">{person.name}</h2>
                                {person.business && <span className="text-merkad-text-secondary">· {person.business}</span>}
                                <Badge className={statusConf.color}>{statusConf.label}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-merkad-text-muted flex-wrap">
                                {person.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{person.email}</span>}
                                {person.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{person.phone}</span>}
                                {person.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{person.website}</span>}
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(person.createdAt)}</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 shrink-0">
                            {isLeadOnly && (
                                <Button size="sm" onClick={handleConvert} disabled={converting}
                                    className="bg-green-600 hover:bg-green-700 text-white">
                                    <UserCheck className="w-4 h-4 mr-1" /> {converting ? 'Converting...' : 'Convert to Client'}
                                </Button>
                            )}
                            {!isLeadOnly && (
                                <>
                                    <Button size="sm" onClick={() => setQuoteDrawerOpen(true)} variant="outline" className="border-merkad-border text-white hover:bg-merkad-bg-tertiary">
                                        <Calculator className="w-4 h-4 mr-1" /> New Quote
                                    </Button>
                                    <Button size="sm" onClick={() => { setPreviewContract(undefined); setDrawerOpen(true); }}
                                        className="bg-merkad-purple hover:bg-merkad-purple-light text-white">
                                        <ScrollText className="w-4 h-4 mr-1" /> New Contract
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ===== AI SUMMARY ===== */}
            {aiSummary && (
                <Card className={`border ${aiSummary.urgency === 'high' ? 'bg-red-500/5 border-red-500/30' :
                    aiSummary.urgency === 'medium' ? 'bg-yellow-500/5 border-yellow-500/30' :
                        'bg-merkad-bg-secondary border-merkad-border'
                    }`}>
                    <CardContent className="pt-5 pb-4">
                        <div className="flex items-start gap-3">
                            <Brain className={`w-5 h-5 mt-0.5 ${aiSummary.urgency === 'high' ? 'text-red-400' :
                                aiSummary.urgency === 'medium' ? 'text-yellow-400' :
                                    'text-merkad-purple'
                                }`} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-semibold text-white">AI Summary</h3>
                                    <Button variant="ghost" size="sm"
                                        onClick={() => loadAISummary(undefined, undefined, undefined, true)}
                                        disabled={summaryLoading}
                                        className="text-merkad-text-muted hover:text-white h-6 text-xs">
                                        {summaryLoading
                                            ? <Loader2 className="w-3 h-3 animate-spin" />
                                            : <RefreshCw className="w-3 h-3" />
                                        }
                                    </Button>
                                </div>
                                <p className="text-sm text-merkad-text-secondary">{aiSummary.insight}</p>
                                <div className="mt-3">
                                    <Button size="sm" variant="outline"
                                        className={`text-xs ${aiSummary.urgency === 'high' ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' :
                                            aiSummary.urgency === 'medium' ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10' :
                                                'border-merkad-border text-merkad-text-muted hover:bg-merkad-bg-tertiary'
                                            }`}
                                    >
                                        {aiSummary.suggestedAction}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {loading && <p className="text-merkad-text-muted text-center py-8">Loading profile data...</p>}

            {!loading && !isLeadOnly && (
                <>
                    {/* ===== QUOTES & CONTRACTS ===== */}
                    <Card className="bg-merkad-bg-secondary border-merkad-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2 text-base">
                                <FileText className="w-5 h-5 text-merkad-purple" />
                                Quotes & Contracts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {quotes.length === 0 && contracts.length === 0 ? (
                                <p className="text-merkad-text-muted text-sm">No quotes or contracts yet.</p>
                            ) : (
                                <>
                                    {/* Contracts first */}
                                    {contracts.map((c) => (
                                        <div key={`c-${c.id}`} className="bg-merkad-bg-tertiary rounded-lg p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ScrollText className="w-4 h-4 text-green-400" />
                                                <div>
                                                    <span className="text-white text-sm font-medium">{c.contractNumber}</span>
                                                    <span className="text-merkad-text-muted text-xs ml-3">
                                                        {formatCurrency(c.finalOneTimeTotal)}
                                                        {c.finalMonthlyTotal > 0 && ` + ${formatCurrency(c.finalMonthlyTotal)}/mo`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={contractStatusColors[c.status]}>{c.status}</Badge>
                                                <Button size="sm" variant="ghost" className="text-xs text-merkad-text-muted hover:text-white h-7"
                                                    onClick={() => { setPreviewContract(c); setDrawerOpen(true); }}>
                                                    <Eye className="w-3 h-3 mr-1" /> View
                                                </Button>
                                                {clientProfile && (
                                                    <Button size="sm" variant="ghost" className="text-xs text-merkad-text-muted hover:text-white h-7"
                                                        onClick={async () => {
                                                            await generateContractPDF(c, clientProfile);
                                                            toast.success('PDF downloaded');
                                                        }}>
                                                        <Download className="w-3 h-3 mr-1" /> PDF
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Quotes */}
                                    {quotes.map((q) => (
                                        <div key={`q-${q.id}`} className="bg-merkad-bg-tertiary rounded-lg p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-4 h-4 text-merkad-purple" />
                                                <div>
                                                    <span className="text-white text-sm font-medium">{q.quoteNumber}</span>
                                                    <span className="text-merkad-text-muted text-xs ml-3">
                                                        {formatCurrency(q.quote.finalOneTimeTotal)}
                                                        {q.quote.finalMonthlyTotal > 0 && ` + ${formatCurrency(q.quote.finalMonthlyTotal)}/mo`}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge className={quoteStatusColors[q.status] || quoteStatusColors.draft}>{q.status}</Badge>
                                        </div>
                                    ))}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* ===== TIMELINE ===== */}
                    <Card className="bg-merkad-bg-secondary border-merkad-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-base">
                                <Clock className="w-5 h-5 text-merkad-purple" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {timeline.length === 0 ? (
                                <p className="text-merkad-text-muted text-sm">No events yet.</p>
                            ) : (
                                <div className="relative">
                                    {/* Vertical line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-merkad-border" />

                                    <div className="space-y-4">
                                        {timeline.map((event) => {
                                            const conf = timelineIcons[event.type] || { icon: Clock, color: 'text-gray-400' };
                                            const EventIcon = conf.icon;
                                            return (
                                                <div key={event.id} className="flex gap-3 relative">
                                                    <div className={`w-6 h-6 rounded-full bg-merkad-bg-tertiary flex items-center justify-center shrink-0 z-10 ${conf.color}`}>
                                                        <EventIcon className="w-3 h-3" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-white">{event.description}</p>
                                                        <p className="text-xs text-merkad-text-muted mt-0.5">{formatDateTime(event.createdAt)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ===== NOTES ===== */}
                    <Card className="bg-merkad-bg-secondary border-merkad-border">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-base">
                                <StickyNote className="w-5 h-5 text-yellow-400" />
                                Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Add Note */}
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Add a note..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="bg-merkad-bg-tertiary border-merkad-border text-white resize-none min-h-[60px]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddNote();
                                    }}
                                />
                                <Button onClick={handleAddNote} disabled={!newNote.trim() || addingNote}
                                    className="bg-merkad-purple hover:bg-merkad-purple-light text-white shrink-0 self-end">
                                    {addingNote ? '...' : 'Add'}
                                </Button>
                            </div>

                            {/* Notes List */}
                            {notes.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-merkad-border">
                                    {notes.map((note) => (
                                        <div key={note.id} className="bg-merkad-bg-tertiary rounded-lg p-3">
                                            <p className="text-sm text-white whitespace-pre-wrap">{note.content}</p>
                                            <p className="text-xs text-merkad-text-muted mt-1">{formatDateTime(note.createdAt)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Lead-only: limited profile */}
            {!loading && isLeadOnly && (
                <Card className="bg-merkad-bg-secondary border-merkad-border">
                    <CardContent className="py-8 text-center">
                        <p className="text-merkad-text-muted">This is a lead. Convert to client to unlock quotes, contracts, timeline, and notes.</p>
                        <Button onClick={handleConvert} disabled={converting} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                            <UserCheck className="w-4 h-4 mr-2" /> {converting ? 'Converting...' : 'Convert to Client'}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
