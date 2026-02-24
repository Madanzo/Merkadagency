import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
    Mail,
    Send,
    Eye,
    X,
    Bot,
    Clock,
    CheckCircle,
    XCircle,
    Edit2,
    Loader2,
    RefreshCw,
    Megaphone,
    ScrollText,
} from 'lucide-react';
import {
    getInboxItems,
    approveAndSend,
    dismissItem,
    updateDraft,
    type InboxItem,
    type InboxStatus,
} from '@/lib/inboxService';

// ============ STATUS CONFIG ============

const STATUS_SECTIONS: { key: InboxStatus; label: string; icon: typeof Mail; color: string; dot: string }[] = [
    { key: 'pending_review', label: 'Needs Review', icon: Bot, color: 'text-red-400', dot: '🔴' },
    { key: 'scheduled', label: 'Scheduled', icon: Clock, color: 'text-yellow-400', dot: '🟡' },
    { key: 'sent', label: 'Sent', icon: CheckCircle, color: 'text-green-400', dot: '🟢' },
];

const SOURCE_ICONS: Record<string, { icon: typeof Mail; color: string }> = {
    sales: { icon: ScrollText, color: 'text-blue-400' },
    marketing: { icon: Megaphone, color: 'text-purple-400' },
    system: { icon: Bot, color: 'text-gray-400' },
};

// ============ MAIN COMPONENT ============

export function InboxTab() {
    const [items, setItems] = useState<InboxItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<InboxItem | null>(null);
    const [editSubject, setEditSubject] = useState('');
    const [editBody, setEditBody] = useState('');
    const [sending, setSending] = useState<string | null>(null);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getInboxItems();
            setItems(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load inbox');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadItems(); }, [loadItems]);

    const handleApprove = async (item: InboxItem) => {
        setSending(item.id);
        try {
            await approveAndSend(item);
            toast.success(`Email sent to ${item.clientName}`);
            loadItems();
        } catch {
            toast.error('Failed to send');
        } finally {
            setSending(null);
        }
    };

    const handleDismiss = async (item: InboxItem) => {
        try {
            await dismissItem(item.id);
            toast.success('Dismissed');
            loadItems();
        } catch {
            toast.error('Failed to dismiss');
        }
    };

    const handleEdit = (item: InboxItem) => {
        setEditingItem(item);
        setEditSubject(item.emailDraft.subject);
        setEditBody(item.emailDraft.body);
    };

    const handleSaveEdit = async () => {
        if (!editingItem) return;
        try {
            await updateDraft(editingItem.id, { subject: editSubject, body: editBody });
            toast.success('Draft updated');
            setEditingItem(null);
            loadItems();
        } catch {
            toast.error('Failed to update');
        }
    };

    const formatDate = (timestamp: any): string => {
        if (!timestamp) return '—';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    // Group items by status
    const grouped = STATUS_SECTIONS.map(section => ({
        ...section,
        items: items.filter(item => item.status === section.key),
    }));

    const pendingCount = grouped[0]?.items.length || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Mail className="w-6 h-6 text-merkad-purple" /> Inbox
                        {pendingCount > 0 && (
                            <Badge className="bg-red-500/20 text-red-400 ml-2">
                                {pendingCount} pending
                            </Badge>
                        )}
                    </h2>
                    <p className="text-merkad-text-muted text-sm mt-1">
                        AI drafts waiting for your approval — nothing sends without you
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadItems} className="border-merkad-border text-merkad-text-muted hover:text-white">
                    <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                </Button>
            </div>

            {/* Edit Modal */}
            {editingItem && (
                <Card className="bg-merkad-bg-secondary border-merkad-purple/30">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-medium">Edit Draft</h3>
                            <Button variant="ghost" size="icon" onClick={() => setEditingItem(null)}>
                                <X className="w-4 h-4 text-merkad-text-muted" />
                            </Button>
                        </div>
                        <Input
                            placeholder="Subject"
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="bg-merkad-bg-tertiary border-merkad-border text-white"
                        />
                        <Textarea
                            placeholder="Email body..."
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            rows={8}
                            className="bg-merkad-bg-tertiary border-merkad-border text-white resize-none"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setEditingItem(null)} className="text-merkad-text-muted">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveEdit} className="bg-merkad-purple hover:bg-merkad-purple-light text-white">
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <p className="text-merkad-text-muted text-center py-8">Loading inbox...</p>
            ) : items.length === 0 ? (
                <Card className="bg-merkad-bg-secondary border-merkad-border">
                    <CardContent className="py-16 text-center">
                        <Mail className="w-12 h-12 text-merkad-purple mx-auto mb-4 opacity-40" />
                        <h3 className="text-white text-lg font-medium mb-2">Inbox is empty</h3>
                        <p className="text-merkad-text-muted text-sm">
                            AI-generated emails will appear here for your review.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                grouped.map((section) => {
                    if (section.items.length === 0) return null;
                    const SectionIcon = section.icon;
                    return (
                        <div key={section.key} className="space-y-2">
                            <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${section.color}`}>
                                <span>{section.dot}</span>
                                {section.label} ({section.items.length})
                            </h3>

                            <div className="space-y-2">
                                {section.items.map((item) => {
                                    const source = SOURCE_ICONS[item.agentSource] || SOURCE_ICONS.system;
                                    const SourceIcon = source.icon;
                                    const isSending = sending === item.id;

                                    return (
                                        <Card key={item.id} className="bg-merkad-bg-secondary border-merkad-border hover:border-merkad-border/80 transition-colors">
                                            <CardContent className="py-3">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <div className={`w-8 h-8 rounded-lg bg-merkad-bg-tertiary flex items-center justify-center shrink-0 ${source.color}`}>
                                                            <SourceIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="bg-merkad-bg-tertiary text-merkad-text-muted text-[10px] shrink-0">
                                                                    AI
                                                                </Badge>
                                                                <p className="text-white text-sm truncate">
                                                                    {item.emailDraft.subject}
                                                                </p>
                                                            </div>
                                                            <p className="text-xs text-merkad-text-muted mt-0.5">
                                                                → {item.clientName}
                                                                {item.clientEmail && ` (${item.clientEmail})`}
                                                                <span className="ml-2">{formatDate(item.createdAt)}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {section.key === 'pending_review' && (
                                                            <>
                                                                <Button size="sm"
                                                                    onClick={() => handleApprove(item)}
                                                                    disabled={isSending}
                                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs h-7">
                                                                    {isSending
                                                                        ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                                                        : <Send className="w-3 h-3 mr-1" />
                                                                    }
                                                                    Send
                                                                </Button>
                                                                <Button variant="ghost" size="sm"
                                                                    onClick={() => handleEdit(item)}
                                                                    className="text-merkad-text-muted hover:text-white h-7 text-xs">
                                                                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                                                                </Button>
                                                                <Button variant="ghost" size="sm"
                                                                    onClick={() => handleDismiss(item)}
                                                                    className="text-red-400 hover:text-red-300 h-7 text-xs">
                                                                    <XCircle className="w-3 h-3 mr-1" /> Dismiss
                                                                </Button>
                                                            </>
                                                        )}
                                                        {section.key === 'scheduled' && (
                                                            <span className="text-xs text-yellow-400">
                                                                {item.scheduledFor ? `Sends ${formatDate(item.scheduledFor)}` : 'Scheduled'}
                                                            </span>
                                                        )}
                                                        {section.key === 'sent' && (
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-xs text-green-400 flex items-center gap-1 px-2 py-1 bg-green-400/10 rounded-full">
                                                                    <CheckCircle className="w-3 h-3" /> Delivered
                                                                </span>
                                                                <Button variant="ghost" size="sm"
                                                                    onClick={() => handleEdit(item)}
                                                                    className="text-merkad-text-muted hover:text-white h-7 text-xs">
                                                                    <Eye className="w-3 h-3 mr-1" /> View
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
