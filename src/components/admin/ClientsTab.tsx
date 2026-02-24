import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContractDrawer } from './ContractDrawer';
import {
    Users,
    Search,
    Plus,
    ArrowLeft,
    FileText,
    ScrollText,
    Download,
    Mail,
    Phone,
    Globe,
    Building2,
    Calendar,
    ChevronRight,
    Trash2,
    Eye,
    PlusCircle,
    Copy,
} from 'lucide-react';
import { getClients, createClient, deleteClient } from '@/lib/clients';
import { getClientQuotes, updateQuoteStatus } from '@/lib/quotes';
import { getClientContracts, createContract, updateContractStatus } from '@/lib/contracts';
import { generateContractPDF } from '@/lib/pricing/generateContract';
import type { ClientProfile } from '@/lib/clients';
import type { SavedQuote, QuoteStatus } from '@/lib/quotes';
import type { Contract, ContractStatus } from '@/lib/contracts';

// ============ FORMAT HELPERS ============

const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

const formatDate = (timestamp: any): string => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ============ STATUS BADGES ============

const quoteStatusColors: Record<QuoteStatus, string> = {
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

// ============ NEW CLIENT FORM ============

function NewClientForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
    const [form, setForm] = useState({
        name: '', business: '', email: '', phone: '', industry: '', website: '', notes: '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name) { toast.error('Name is required'); return; }
        setSaving(true);
        try {
            await createClient(form);
            toast.success('Client created!');
            onSave();
        } catch (err) {
            toast.error('Failed to create client');
        } finally { setSaving(false); }
    };

    return (
        <Card className="bg-merkad-bg-secondary border-merkad-border">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="w-5 h-5" /> New Client
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Client Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white" />
                    <Input placeholder="Business Name" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white" />
                    <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white" />
                    <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white" />
                    <Input placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white" />
                    <Input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white" />
                    <div className="md:col-span-2 flex gap-2">
                        <Button type="submit" disabled={saving} className="bg-merkad-purple hover:bg-merkad-purple-light text-white">
                            {saving ? 'Saving...' : 'Create Client'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}
                            className="border-merkad-border text-white hover:bg-merkad-bg-tertiary">Cancel</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

// ============ CLIENT DETAIL VIEW ============

function ClientDetail({
    client,
    onBack,
    onRefresh,
}: {
    client: ClientProfile;
    onBack: () => void;
    onRefresh: () => void;
}) {
    const [quotes, setQuotes] = useState<SavedQuote[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [previewContract, setPreviewContract] = useState<Contract | undefined>(undefined);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [q, c] = await Promise.all([
                getClientQuotes(client.id),
                getClientContracts(client.id),
            ]);
            setQuotes(q);
            setContracts(c);
        } catch (err) {
            toast.error('Failed to load client data');
        } finally { setLoading(false); }
    }, [client.id]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleQuoteStatusChange = async (quoteId: string, status: QuoteStatus) => {
        try {
            await updateQuoteStatus(client.id, quoteId, status);
            toast.success(`Quote marked as ${status}`);
            loadData();
        } catch (err) { toast.error('Failed to update'); }
    };

    const handleGenerateContract = async (q: SavedQuote) => {
        try {
            await createContract(client.id, q.id, q.quote, q.projectInfo, client.leadId);
            toast.success('Contract generated!');
            loadData();
        } catch (err) { toast.error('Failed to generate contract'); }
    };

    const handleOpenDrawer = (contract?: Contract) => {
        setPreviewContract(contract);
        setDrawerOpen(true);
    };

    const handleContractStatusChange = async (contractId: string, status: ContractStatus) => {
        try {
            await updateContractStatus(client.id, contractId, status);
            toast.success(`Contract marked as ${status}`);
            loadData();
        } catch (err) { toast.error('Failed to update'); }
    };

    const handleDownloadContract = async (contract: Contract) => {
        try {
            await generateContractPDF(contract, client);
            toast.success('Contract PDF downloaded!');
        } catch (err) { toast.error('Failed to generate PDF'); }
    };

    const handleDeleteClient = async () => {
        if (!confirm(`Delete client "${client.name}"? This cannot be undone.`)) return;
        try {
            await deleteClient(client.id);
            toast.success('Client deleted');
            onBack();
            onRefresh();
        } catch (err) { toast.error('Failed to delete'); }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="text-merkad-text-muted hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
                </Button>
                <Button variant="ghost" onClick={handleDeleteClient} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Client
                </Button>
            </div>

            {/* Contract Drawer */}
            <ContractDrawer
                open={drawerOpen}
                onClose={() => { setDrawerOpen(false); setPreviewContract(undefined); }}
                onContractCreated={() => loadData()}
                client={client}
                leadId={client.leadId}
                existingContract={previewContract}
            />

            {/* Client Info Card */}
            <Card className="bg-merkad-bg-secondary border-merkad-border">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                            {client.business && <p className="text-merkad-text-secondary mt-1">{client.business}</p>}
                        </div>
                        <Badge className="bg-merkad-purple/20 text-merkad-purple">{client.industry || 'No Industry'}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {client.email && (
                            <div className="flex items-center gap-2 text-sm text-merkad-text-secondary">
                                <Mail className="w-4 h-4" /> {client.email}
                            </div>
                        )}
                        {client.phone && (
                            <div className="flex items-center gap-2 text-sm text-merkad-text-secondary">
                                <Phone className="w-4 h-4" /> {client.phone}
                            </div>
                        )}
                        {client.website && (
                            <div className="flex items-center gap-2 text-sm text-merkad-text-secondary">
                                <Globe className="w-4 h-4" /> {client.website}
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-merkad-text-secondary">
                            <Calendar className="w-4 h-4" /> {formatDate(client.createdAt)}
                        </div>
                    </div>

                    {client.notes && (
                        <p className="text-sm text-merkad-text-muted mt-4 border-t border-merkad-border pt-4">{client.notes}</p>
                    )}
                </CardContent>
            </Card>

            {/* Quotes */}
            <Card className="bg-merkad-bg-secondary border-merkad-border">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-merkad-purple" />
                        Quotes ({quotes.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-merkad-text-muted text-sm">Loading...</p>
                    ) : quotes.length === 0 ? (
                        <p className="text-merkad-text-muted text-sm">No quotes yet. Use the Calculator to create one.</p>
                    ) : (
                        <div className="space-y-3">
                            {quotes.map((q) => (
                                <div key={q.id} className="bg-merkad-bg-tertiary rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white font-medium">{q.quoteNumber}</span>
                                            <Badge className={quoteStatusColors[q.status]}>{q.status}</Badge>
                                        </div>
                                        <p className="text-sm text-merkad-text-muted mt-1">
                                            One-time: {formatCurrency(q.quote.finalOneTimeTotal)}
                                            {q.quote.finalMonthlyTotal > 0 && ` • Monthly: ${formatCurrency(q.quote.finalMonthlyTotal)}/mo`}
                                        </p>
                                        <p className="text-xs text-merkad-text-muted">{formatDate(q.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {q.status === 'draft' && (
                                            <Button size="sm" variant="outline" onClick={() => handleQuoteStatusChange(q.id, 'sent')}
                                                className="text-xs border-merkad-border text-white hover:bg-merkad-bg-tertiary">Mark Sent</Button>
                                        )}
                                        {q.status === 'sent' && (
                                            <>
                                                <Button size="sm" onClick={() => handleQuoteStatusChange(q.id, 'accepted')}
                                                    className="text-xs bg-green-600 hover:bg-green-700 text-white">Accepted</Button>
                                                <Button size="sm" variant="outline" onClick={() => handleQuoteStatusChange(q.id, 'rejected')}
                                                    className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">Rejected</Button>
                                            </>
                                        )}
                                        {q.status === 'accepted' && (
                                            <Button size="sm" onClick={() => handleGenerateContract(q)}
                                                className="text-xs bg-merkad-purple hover:bg-merkad-purple-light text-white">
                                                <ScrollText className="w-3 h-3 mr-1" /> Generate Contract
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contracts */}
            <Card className="bg-merkad-bg-secondary border-merkad-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <ScrollText className="w-5 h-5 text-green-400" />
                        Contracts ({contracts.length})
                    </CardTitle>
                    <Button size="sm" onClick={() => handleOpenDrawer()} className="bg-merkad-purple hover:bg-merkad-purple-light text-white">
                        <PlusCircle className="w-4 h-4 mr-1" /> Create Contract
                    </Button>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-merkad-text-muted text-sm">Loading...</p>
                    ) : contracts.length === 0 ? (
                        <p className="text-merkad-text-muted text-sm">No contracts yet. Accept a quote to generate one.</p>
                    ) : (
                        <div className="space-y-3">
                            {contracts.map((c) => (
                                <div key={c.id} className="bg-merkad-bg-tertiary rounded-lg p-4 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white font-medium">{c.contractNumber}</span>
                                            <Badge className={contractStatusColors[c.status]}>{c.status}</Badge>
                                        </div>
                                        <p className="text-sm text-merkad-text-muted mt-1">
                                            One-time: {formatCurrency(c.finalOneTimeTotal)}
                                            {c.finalMonthlyTotal > 0 && ` • Monthly: ${formatCurrency(c.finalMonthlyTotal)}/mo`}
                                        </p>
                                        <p className="text-xs text-merkad-text-muted">{formatDate(c.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleOpenDrawer(c)}
                                            className="text-xs border-merkad-border text-white hover:bg-merkad-bg-tertiary">
                                            <Eye className="w-3 h-3 mr-1" /> Preview
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDownloadContract(c)}
                                            className="text-xs border-merkad-border text-white hover:bg-merkad-bg-tertiary">
                                            <Download className="w-3 h-3 mr-1" /> PDF
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// ============ MAIN CLIENTS TAB ============

export function ClientsTab() {
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showNewForm, setShowNewForm] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

    const loadClients = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getClients();
            setClients(data);
        } catch (err) {
            toast.error('Failed to load clients');
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadClients(); }, [loadClients]);

    const filtered = clients.filter((c) => {
        if (!search) return true;
        const term = search.toLowerCase();
        return c.name.toLowerCase().includes(term) ||
            c.business.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term) ||
            c.industry.toLowerCase().includes(term);
    });

    // Detail view
    if (selectedClient) {
        return (
            <ClientDetail
                client={selectedClient}
                onBack={() => { setSelectedClient(null); loadClients(); }}
                onRefresh={loadClients}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-merkad-purple" /> Clients
                </h2>
                <Button onClick={() => setShowNewForm(!showNewForm)} className="bg-merkad-purple hover:bg-merkad-purple-light text-white">
                    <Plus className="w-4 h-4 mr-2" /> New Client
                </Button>
            </div>

            {/* New Client Form */}
            {showNewForm && (
                <NewClientForm
                    onSave={() => { setShowNewForm(false); loadClients(); }}
                    onCancel={() => setShowNewForm(false)}
                />
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-merkad-text-muted" />
                <Input
                    placeholder="Search clients by name, business, email, industry..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-merkad-bg-secondary border-merkad-border text-white"
                />
            </div>

            {/* Client List */}
            {loading ? (
                <Card className="bg-merkad-bg-secondary border-merkad-border">
                    <CardContent className="py-12 text-center text-merkad-text-muted">Loading clients...</CardContent>
                </Card>
            ) : filtered.length === 0 ? (
                <Card className="bg-merkad-bg-secondary border-merkad-border">
                    <CardContent className="py-12 text-center text-merkad-text-muted">
                        {search ? 'No clients match your search.' : 'No clients yet. Save a quote from the Calculator to create one, or click "New Client".'}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {filtered.map((client) => (
                        <Card
                            key={client.id}
                            className="bg-merkad-bg-secondary border-merkad-border hover:border-merkad-purple/50 cursor-pointer transition-colors"
                            onClick={() => setSelectedClient(client)}
                        >
                            <CardContent className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-merkad-purple/20 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-merkad-purple" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{client.name}</p>
                                        <div className="flex items-center gap-3 text-xs text-merkad-text-muted mt-1">
                                            {client.business && <span>{client.business}</span>}
                                            {client.email && <span>• {client.email}</span>}
                                            {client.industry && <span>• {client.industry}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-merkad-text-muted">{formatDate(client.createdAt)}</span>
                                    <ChevronRight className="w-4 h-4 text-merkad-text-muted" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
