import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getConversations, Conversation } from '@/lib/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, MessageSquare, Mail, Smartphone, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

export function Conversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getConversations();
            setConversations(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load conversations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'email': return <Mail className="w-4 h-4" />;
            case 'sms': return <Smartphone className="w-4 h-4" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'escalated': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'converted': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Conversations</h2>
                    <p className="text-merkad-text-muted">Monitor active discussions handled by AI agents</p>
                </div>
                <Button variant="outline" onClick={loadData} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="grid gap-4">
                {conversations.length === 0 && !loading && (
                    <div className="text-center py-12 text-merkad-text-muted border border-dashed border-merkad-border rounded-lg">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-white mb-2">No Conversations Yet</h3>
                        <p>When customers reply to emails or SMS, threads will appear here.</p>
                    </div>
                )}

                {conversations.map((conv) => (
                    <Card key={conv.id} className="bg-merkad-bg-secondary border-merkad-border hover:bg-merkad-bg-tertiary transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full bg-merkad-purple/10`}>
                                    <User className="w-5 h-5 text-merkad-purple" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-white">Lead #{conv.leadId.slice(0, 6)}</h4>
                                        <Badge variant="outline" className={`capitalize ${getStatusColor(conv.status)}`}>
                                            {conv.status}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs border-merkad-border text-merkad-text-muted">
                                            {conv.agentType === 'sales' ? 'Carlos (Sales)' : 'Maria (Support)'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-merkad-text-muted">
                                        <div className="flex items-center gap-1">
                                            {getChannelIcon(conv.channel)}
                                            <span className="capitalize">{conv.channel}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{conv.metadata?.messageCount || 0} messages</span>
                                        <span>•</span>
                                        <span>Last active: {conv.metadata?.lastMessageAt ? format(conv.metadata.lastMessageAt.toDate(), 'MMM d, h:mm a') : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">View Thread</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
