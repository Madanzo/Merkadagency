import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle, XCircle, Clock, RefreshCw, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface EmailLog {
    id: string;
    to: string;
    type: string;
    status: 'sent' | 'failed' | 'pending';
    resendId?: string;
    error?: string;
    sentAt: Timestamp | Date;
}

const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    try {
        if (typeof dateValue.toDate === 'function') {
            return format(dateValue.toDate(), 'MMM d, yyyy h:mm a');
        }
        return format(new Date(dateValue), 'MMM d, yyyy h:mm a');
    } catch {
        return 'Invalid Date';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'sent':
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'failed':
            return <XCircle className="w-4 h-4 text-red-500" />;
        default:
            return <Clock className="w-4 h-4 text-yellow-500" />;
    }
};

const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        'welcome': 'Welcome Email',
        'contact_thank_you': 'Contact Thank You',
        'booking_confirmation': 'Booking Confirmation',
        'manual': 'Manual Send',
        'broadcast': 'Broadcast',
    };
    return labels[type] || type;
};

export function EmailCampaignsTab() {
    const [logs, setLogs] = useState<EmailLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ sent: 0, failed: 0, total: 0 });

    const loadLogs = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'email_logs'),
                orderBy('sentAt', 'desc'),
                limit(50)
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as EmailLog[];
            setLogs(data);

            // Calculate stats
            const sent = data.filter(l => l.status === 'sent').length;
            const failed = data.filter(l => l.status === 'failed').length;
            setStats({ sent, failed, total: data.length });
        } catch (error) {
            console.error('Error loading email logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <Card className="bg-merkad-bg-secondary border-merkad-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Email Campaigns & Logs
                    </CardTitle>
                    <Button onClick={loadLogs} variant="outline" size="sm" disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-merkad-bg-tertiary rounded-lg p-4">
                        <div className="flex items-center gap-2 text-merkad-text-muted mb-1">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">Total Sent</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-merkad-bg-tertiary rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-400 mb-1">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Delivered</span>
                        </div>
                        <p className="text-2xl font-bold text-green-400">{stats.sent}</p>
                    </div>
                    <div className="bg-merkad-bg-tertiary rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-400 mb-1">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm">Failed</span>
                        </div>
                        <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
                    </div>
                </div>

                {/* Email Logs */}
                <div className="space-y-2">
                    <h3 className="text-white font-medium mb-3">Recent Activity</h3>
                    {logs.length === 0 ? (
                        <div className="text-center py-8 text-merkad-text-muted">
                            No emails sent yet. Emails will appear here when sent via forms or triggers.
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between p-3 bg-merkad-bg-tertiary rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(log.status)}
                                    <div>
                                        <p className="text-white text-sm">{log.to}</p>
                                        <p className="text-xs text-merkad-text-muted">
                                            {getTypeLabel(log.type)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-merkad-text-muted">
                                        {formatDate(log.sentAt)}
                                    </p>
                                    {log.error && (
                                        <p className="text-xs text-red-400 max-w-[200px] truncate">
                                            {log.error}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
