import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getApprovalQueue, approveResponse, rejectResponse, ApprovalItem } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Check, X, Edit, MessageSquare } from 'lucide-react';

export function ApprovalQueue() {
    const [items, setItems] = useState<ApprovalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getApprovalQueue();
            setItems(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load approval queue");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleApprove = async (item: ApprovalItem) => {
        try {
            const finalResponse = editingId === item.id ? editValue : item.proposedResponse;
            await approveResponse(item.id, finalResponse);
            toast.success("Response approved and queued for sending");
            setEditingId(null);
            loadData(); // Refresh list
        } catch (error) {
            toast.error("Failed to approve");
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Reject this response? The AI will not reply.")) return;
        try {
            await rejectResponse(id);
            toast.success("Response rejected");
            loadData();
        } catch (error) {
            toast.error("Failed to reject");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Approval Queue</h2>
                    <p className="text-merkad-text-muted">Review pending responses from AI agents</p>
                </div>
                <Button variant="outline" onClick={loadData} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="grid gap-4">
                {items.length === 0 && !loading && (
                    <div className="text-center py-12 text-merkad-text-muted border border-dashed border-merkad-border rounded-lg">
                        <Check className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-2">All Caught Up!</h3>
                        <p>No pending responses waiting for approval.</p>
                    </div>
                )}

                {items.map((item) => (
                    <Card key={item.id} className="bg-merkad-bg-secondary border-merkad-border">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-merkad-border text-merkad-text-muted capitalize">
                                        {item.channel}
                                    </Badge>
                                    <span className="text-sm font-medium text-white">
                                        {item.leadEmail || item.leadPhone || 'Unknown Lead'}
                                    </span>
                                </div>
                                <span className="text-xs text-merkad-text-muted">
                                    Agent: {item.agentType}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-merkad-bg-tertiary p-3 rounded text-sm text-merkad-text-muted">
                                <p className="font-semibold text-xs uppercase mb-1 opacity-70">Customer Said:</p>
                                "{item.originalMessage}"
                            </div>

                            <div className="relative">
                                <p className="font-semibold text-xs uppercase mb-1 text-merkad-purple">AI Proposed Response:</p>
                                {editingId === item.id ? (
                                    <Textarea
                                        className="bg-merkad-bg-primary border-merkad-border text-white mt-1"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                    />
                                ) : (
                                    <div className="bg-merkad-bg-primary p-3 rounded text-sm text-white border border-merkad-purple/20">
                                        {item.proposedResponse}
                                    </div>
                                )}
                                <p className="text-xs text-merkad-text-muted mt-2 italic">
                                    Reasoning: {item.aiReasoning}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                            {editingId === item.id ? (
                                <Button variant="ghost" onClick={() => setEditingId(null)} size="sm">
                                    Cancel Edit
                                </Button>
                            ) : (
                                <Button variant="ghost" onClick={() => { setEditingId(item.id); setEditValue(item.proposedResponse); }} size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleReject(item.id)}
                                    variant="destructive"
                                    size="sm"
                                    className="bg-red-900/50 hover:bg-red-900 border border-red-900"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    onClick={() => handleApprove(item)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve & Send
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
