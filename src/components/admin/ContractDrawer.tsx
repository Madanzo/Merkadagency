import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    X,
    FileDown,
    Send,
    Eye,
    Copy,
    CheckCircle2,
    XCircle,
    Loader2,
} from 'lucide-react';
import { getClientQuotes } from '@/lib/quotes';
import { createContract, updateContractStatus, duplicateContract } from '@/lib/contracts';
import { generateContractPDF } from '@/lib/pricing/generateContract';
import { generateContractHTML } from '@/lib/pricing/contractTemplate';
import type { ClientProfile } from '@/lib/clients';
import type { SavedQuote } from '@/lib/quotes';
import type { Contract, ContractStatus } from '@/lib/contracts';

// ============ TYPES ============

interface ContractDrawerProps {
    open: boolean;
    onClose: () => void;
    onContractCreated: () => void;
    client: ClientProfile;
    leadId?: string;
    // If editing/previewing an existing contract
    existingContract?: Contract;
}

// ============ STATUS HELPERS ============

const statusColors: Record<ContractStatus, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    sent: 'bg-blue-500/20 text-blue-400',
    signed: 'bg-green-500/20 text-green-400',
    declined: 'bg-orange-500/20 text-orange-400',
    cancelled: 'bg-red-500/20 text-red-400',
};

const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

// ============ MAIN COMPONENT ============

export function ContractDrawer({
    open,
    onClose,
    onContractCreated,
    client,
    leadId,
    existingContract,
}: ContractDrawerProps) {
    const [quotes, setQuotes] = useState<SavedQuote[]>([]);
    const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [showPreview, setShowPreview] = useState(!!existingContract);
    const [previewHTML, setPreviewHTML] = useState('');
    const [currentContract, setCurrentContract] = useState<Contract | null>(existingContract || null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Load client quotes on open
    useEffect(() => {
        if (open && client.id && !existingContract) {
            setLoading(true);
            getClientQuotes(client.id)
                .then((q) => {
                    setQuotes(q);
                    if (q.length > 0) setSelectedQuoteId(q[0].id);
                })
                .catch(() => toast.error('Failed to load quotes'))
                .finally(() => setLoading(false));
        }
    }, [open, client.id, existingContract]);

    // Generate preview when existing contract is provided
    useEffect(() => {
        if (existingContract) {
            setCurrentContract(existingContract);
            setPreviewHTML(generateContractHTML(existingContract, client));
            setShowPreview(true);
        }
    }, [existingContract, client]);

    // Reset on close
    useEffect(() => {
        if (!open) {
            setSelectedQuoteId('');
            setShowPreview(false);
            setPreviewHTML('');
            setCurrentContract(null);
        }
    }, [open]);

    const selectedQuote = quotes.find((q) => q.id === selectedQuoteId);

    const handleCreateContract = async () => {
        if (!selectedQuote) {
            toast.error('Please select a quote');
            return;
        }
        setCreating(true);
        try {
            const contractId = await createContract(
                client.id,
                selectedQuote.id,
                selectedQuote.quote,
                selectedQuote.projectInfo,
                leadId
            );

            // Build a temporary contract object for preview
            const tempContract: Contract = {
                id: contractId,
                clientId: client.id,
                quoteId: selectedQuote.id,
                leadId,
                contractNumber: 'MRK-...',
                services: [
                    { label: selectedQuote.quote.basePackage.label, price: selectedQuote.quote.basePackage.price },
                    ...selectedQuote.quote.addons.map((a) => ({ label: a.label, price: a.price })),
                ],
                monthlyServices: selectedQuote.quote.monthly.map((m) => ({ label: m.label, price: m.price })),
                oneTimeTotal: selectedQuote.quote.oneTimeTotal,
                monthlyTotal: selectedQuote.quote.monthlyTotal,
                finalOneTimeTotal: selectedQuote.quote.finalOneTimeTotal,
                finalMonthlyTotal: selectedQuote.quote.finalMonthlyTotal,
                paymentTerms: selectedQuote.projectInfo.paymentTerms || '50-50',
                projectInfo: selectedQuote.projectInfo,
                status: 'draft',
                createdAt: {} as any,
                updatedAt: {} as any,
            };

            setCurrentContract(tempContract);
            setPreviewHTML(generateContractHTML(tempContract, client));
            setShowPreview(true);
            toast.success('Contract created!');
            onContractCreated();
        } catch (err) {
            console.error(err);
            toast.error('Failed to create contract');
        } finally {
            setCreating(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!currentContract) return;
        try {
            await generateContractPDF(currentContract, client);
            toast.success('PDF downloaded!');
        } catch (err) {
            toast.error('Failed to generate PDF');
        }
    };

    const handleSendEmail = () => {
        const subject = encodeURIComponent(`MerkadAgency Contract ${currentContract?.contractNumber || ''}`);
        const body = encodeURIComponent(`Hi ${client.name},\n\nPlease find attached our service agreement for your review.\n\nBest regards,\nMerkadAgency`);
        window.open(`mailto:${client.email || ''}?subject=${subject}&body=${body}`);
    };

    const handleMarkSent = async () => {
        if (!currentContract) return;
        try {
            await updateContractStatus(client.id, currentContract.id, 'sent');
            setCurrentContract({ ...currentContract, status: 'sent' });
            toast.success('Contract marked as sent');
            onContractCreated();
        } catch { toast.error('Failed to update'); }
    };

    const handleMarkSigned = async () => {
        if (!currentContract) return;
        try {
            await updateContractStatus(client.id, currentContract.id, 'signed');
            setCurrentContract({ ...currentContract, status: 'signed' });
            toast.success('Contract marked as signed! Lead synced.');
            onContractCreated();
        } catch { toast.error('Failed to update'); }
    };

    const handleMarkDeclined = async () => {
        if (!currentContract) return;
        try {
            await updateContractStatus(client.id, currentContract.id, 'declined');
            setCurrentContract({ ...currentContract, status: 'declined' });
            toast.success('Contract marked as declined.');
            onContractCreated();
        } catch { toast.error('Failed to update'); }
    };

    const handleDuplicate = async () => {
        if (!currentContract) return;
        try {
            await duplicateContract(client.id, currentContract.id);
            toast.success('Contract duplicated as new draft');
            onContractCreated();
            onClose();
        } catch { toast.error('Failed to duplicate'); }
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-merkad-bg-secondary border-l border-merkad-border z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-merkad-border shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            {existingContract ? `Contract ${existingContract.contractNumber}` : 'New Contract'}
                        </h2>
                        <p className="text-sm text-merkad-text-muted">{client.name}{client.business ? ` — ${client.business}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {currentContract && (
                            <Badge className={statusColors[currentContract.status]}>
                                {currentContract.status}
                            </Badge>
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-merkad-text-muted hover:text-white">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Step 1: Select Quote (only for new contracts) */}
                    {!showPreview && (
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="text-sm font-medium text-white block mb-2">Select Quote</label>
                                {loading ? (
                                    <div className="flex items-center gap-2 text-merkad-text-muted text-sm py-4">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Loading quotes...
                                    </div>
                                ) : quotes.length === 0 ? (
                                    <p className="text-merkad-text-muted text-sm py-4">
                                        No quotes found. Create a quote from the Pricing calculator first.
                                    </p>
                                ) : (
                                    <Select value={selectedQuoteId} onValueChange={setSelectedQuoteId}>
                                        <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border text-white">
                                            <SelectValue placeholder="Choose a quote..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {quotes.map((q) => (
                                                <SelectItem key={q.id} value={q.id}>
                                                    {q.quoteNumber} — {formatCurrency(q.quote.finalOneTimeTotal)}
                                                    {q.quote.finalMonthlyTotal > 0 && ` + ${formatCurrency(q.quote.finalMonthlyTotal)}/mo`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {/* Quote Preview Summary */}
                            {selectedQuote && (
                                <div className="bg-merkad-bg-tertiary rounded-lg p-4 space-y-3">
                                    <h3 className="text-white font-medium text-sm">Quote Summary</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between text-merkad-text-secondary">
                                            <span>{selectedQuote.quote.basePackage.label}</span>
                                            <span>{formatCurrency(selectedQuote.quote.basePackage.price)}</span>
                                        </div>
                                        {selectedQuote.quote.addons.map((a, i) => (
                                            <div key={i} className="flex justify-between text-merkad-text-muted">
                                                <span className="truncate mr-4">{a.label}</span>
                                                <span className="whitespace-nowrap">{formatCurrency(a.price)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-merkad-border pt-2 mt-2 space-y-1">
                                        <div className="flex justify-between font-semibold text-white">
                                            <span>One-Time Total</span>
                                            <span>{formatCurrency(selectedQuote.quote.finalOneTimeTotal)}</span>
                                        </div>
                                        {selectedQuote.quote.finalMonthlyTotal > 0 && (
                                            <div className="flex justify-between font-semibold text-green-400">
                                                <span>Monthly Total</span>
                                                <span>{formatCurrency(selectedQuote.quote.finalMonthlyTotal)}/mo</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleCreateContract}
                                disabled={!selectedQuoteId || creating}
                                className="w-full bg-merkad-purple hover:bg-merkad-purple-light text-white"
                            >
                                {creating ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                                ) : (
                                    'Create Contract'
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Contract Preview */}
                    {showPreview && previewHTML && (
                        <div className="p-4">
                            <iframe
                                ref={iframeRef}
                                srcDoc={previewHTML}
                                className="w-full rounded-lg border border-merkad-border"
                                style={{ height: '70vh' }}
                                title="Contract Preview"
                            />
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {showPreview && currentContract && (
                    <div className="border-t border-merkad-border px-6 py-4 shrink-0 space-y-3">
                        {/* Primary actions */}
                        <div className="flex gap-2">
                            <Button onClick={handleDownloadPDF} className="flex-1 bg-merkad-purple hover:bg-merkad-purple-light text-white">
                                <FileDown className="w-4 h-4 mr-2" /> Download PDF
                            </Button>
                            <Button onClick={handleSendEmail} variant="outline" className="flex-1 border-merkad-border text-white hover:bg-merkad-bg-tertiary">
                                <Send className="w-4 h-4 mr-2" /> Email Client
                            </Button>
                        </div>

                        {/* Status actions */}
                        <div className="flex gap-2">
                            {currentContract.status === 'draft' && (
                                <Button onClick={handleMarkSent} size="sm" variant="outline" className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                                    <Send className="w-3 h-3 mr-1" /> Mark Sent
                                </Button>
                            )}
                            {(currentContract.status === 'draft' || currentContract.status === 'sent') && (
                                <>
                                    <Button onClick={handleMarkSigned} size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Signed
                                    </Button>
                                    <Button onClick={handleMarkDeclined} size="sm" variant="outline" className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                                        <XCircle className="w-3 h-3 mr-1" /> Declined
                                    </Button>
                                </>
                            )}
                            <Button onClick={handleDuplicate} size="sm" variant="outline" className="border-merkad-border text-merkad-text-muted hover:text-white hover:bg-merkad-bg-tertiary">
                                <Copy className="w-3 h-3 mr-1" /> Duplicate
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
