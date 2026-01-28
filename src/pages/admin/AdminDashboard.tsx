import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getLeads, getLeadStats, Lead, updateLead, deleteLead } from '@/lib/firestore';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Search, MoreVertical, User, RefreshCw, Users, Calendar, TrendingUp, Mail, FileText, Send, Workflow } from 'lucide-react';
import { EmailSubscribersTab } from '@/components/admin/EmailSubscribersTab';
import { EmailTemplatesTab } from '@/components/admin/EmailTemplatesTab';
import { EmailCampaignsTab } from '@/components/admin/EmailCampaignsTab';
import { EmailSequencesTab } from '@/components/admin/EmailSequencesTab';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

type LeadStatus = Lead['status'];

const statusColumns: { status: LeadStatus; label: string; color: string }[] = [
    { status: 'new', label: 'New', color: 'border-blue-500' },
    { status: 'contacted', label: 'Contacted', color: 'border-yellow-500' },
    { status: 'qualified', label: 'Qualified', color: 'border-purple-500' },
    { status: 'closed-won', label: 'Closed Won', color: 'border-green-500' },
];

// Helper to safely format dates from any source (Timestamp, Date, string, null)
const formatDate = (dateValue: Timestamp | Date | string | number | null | undefined, formatString: string = 'MMM d, yyyy') => {
    if (!dateValue) return 'N/A';

    try {
        // Handle Firestore Timestamp
        if (dateValue instanceof Timestamp || (typeof dateValue === 'object' && 'toDate' in dateValue && typeof (dateValue as { toDate: () => Date }).toDate === 'function')) {
            return format((dateValue as Timestamp).toDate(), formatString);
        }

        // Handle JS Date or string/number
        const dateObj = new Date(dateValue as unknown as string | number | Date);
        // Check if valid date
        if (isNaN(dateObj.getTime())) return 'Invalid Date';

        return format(dateObj, formatString);
    } catch (e) {
        console.error("Date formatting error:", e);
        return 'Error';
    }
};

export default function AdminDashboard() {
    const { user, signOut } = useAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<Record<LeadStatus, number>>({
        new: 0,
        contacted: 0,
        qualified: 0,
        'closed-won': 0,
        'closed-lost': 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [leadsData, statsData] = await Promise.all([
                getLeads(),
                getLeadStats(),
            ]);
            setLeads(leadsData || []);
            setStats(statsData || { new: 0, contacted: 0, qualified: 0, 'closed-won': 0, 'closed-lost': 0 });
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
        await updateLead(leadId, { status: newStatus });
        await loadData();
    };

    const handleDeleteLead = async (leadId: string) => {
        if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
            const toastId = toast.loading('Deleting lead...');
            try {
                await deleteLead(leadId);
                await loadData();
                toast.success('Lead deleted successfully', { id: toastId });
            } catch (error) {
                console.error('Error deleting lead:', error);
                toast.error('Failed to delete lead. Please check your permissions.', { id: toastId });
            }
        }
    };

    const filteredLeads = leads.filter((lead) =>
        (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getLeadsByStatus = (status: LeadStatus) =>
        leads.filter((lead) => lead.status === status);

    // Calculate this month's leads
    const thisMonthLeads = leads.filter((lead) => {
        const dateValue = lead.createdAt;
        let createdDate: Date;

        if (dateValue && typeof dateValue === 'object' && 'toDate' in dateValue) {
            createdDate = (dateValue as Timestamp).toDate();
        } else {
            createdDate = new Date(dateValue as unknown as string | number | Date);
        }

        if (isNaN(createdDate.getTime())) return false;

        const now = new Date();
        return createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear();
    }).length;

    // Calculate conversion rate
    const totalLeads = leads.length;
    const wonLeads = stats['closed-won'];
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

    return (
        <div className="min-h-screen bg-merkad-bg-primary">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-merkad-bg-secondary border-b border-merkad-border">
                <div className="container-custom py-4 flex items-center justify-between">
                    <h1 className="text-xl font-display font-bold text-white">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-merkad-text-muted">
                            <User className="w-4 h-4" />
                            <span>{user?.email}</span>
                        </div>
                        <Button onClick={signOut} variant="outline" size="sm" className="gap-2">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        label="Total Leads"
                        value={totalLeads}
                        trend={totalLeads > 0 ? 'up' : undefined}
                        trendValue={totalLeads > 0 ? `${stats['new']} new` : undefined}
                    />
                    <StatCard
                        label="This Month"
                        value={thisMonthLeads}
                        trend="up"
                        trendValue={`${thisMonthLeads} leads`}
                    />
                    <StatCard
                        label="Conversion Rate"
                        value={`${conversionRate}%`}
                        trend={Number(conversionRate) > 0 ? 'up' : undefined}
                        trendValue={wonLeads > 0 ? `${wonLeads} won` : undefined}
                    />
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end mb-4">
                    <Button onClick={loadData} variant="outline" size="sm" className="gap-2" disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="pipeline" className="w-full">
                    <TabsList className="bg-merkad-bg-secondary border border-merkad-border mb-6">
                        <TabsTrigger value="pipeline" className="gap-2">
                            <Users className="w-4 h-4" />
                            Pipeline
                        </TabsTrigger>
                        <TabsTrigger value="all-leads" className="gap-2">
                            <Calendar className="w-4 h-4" />
                            All Leads
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Activity
                        </TabsTrigger>
                        <TabsTrigger value="subscribers" className="gap-2">
                            <Mail className="w-4 h-4" />
                            Subscribers
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="gap-2">
                            <FileText className="w-4 h-4" />
                            Templates
                        </TabsTrigger>
                        <TabsTrigger value="campaigns" className="gap-2">
                            <Send className="w-4 h-4" />
                            Campaigns
                        </TabsTrigger>
                        <TabsTrigger value="sequences" className="gap-2">
                            <Workflow className="w-4 h-4" />
                            Sequences
                        </TabsTrigger>
                    </TabsList>

                    {/* Pipeline Tab - Kanban Style */}
                    <TabsContent value="pipeline">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statusColumns.map(({ status, label, color }) => (
                                <div key={status} className={`bg-merkad-bg-secondary rounded-xl border-t-4 ${color} p-4`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-white">{label}</h3>
                                        <span className="text-sm text-merkad-text-muted bg-merkad-bg-tertiary px-2 py-1 rounded">
                                            {getLeadsByStatus(status).length}
                                        </span>
                                    </div>
                                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                        {getLeadsByStatus(status).map((lead) => (
                                            <Card key={lead.id} className="bg-merkad-bg-tertiary border-merkad-border">
                                                <CardContent className="p-3">
                                                    <p className="font-medium text-white text-sm">{lead.name || 'Unnamed Lead'}</p>
                                                    <p className="text-xs text-merkad-text-muted truncate">{lead.email || 'No Email'}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-merkad-text-muted capitalize">
                                                            {lead.source}
                                                        </span>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {statusColumns.map((col) => (
                                                                    <DropdownMenuItem
                                                                        key={col.status}
                                                                        onClick={() => handleStatusChange(lead.id, col.status)}
                                                                        disabled={col.status === status}
                                                                    >
                                                                        Move to {col.label}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusChange(lead.id, 'closed-lost')}
                                                                    className="text-orange-500"
                                                                >
                                                                    Mark as Lost
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onSelect={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteLead(lead.id);
                                                                    }}
                                                                    className="text-red-500 font-medium cursor-pointer"
                                                                >
                                                                    Delete Lead
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {getLeadsByStatus(status).length === 0 && (
                                            <p className="text-sm text-merkad-text-muted text-center py-4">No leads</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* All Leads Tab - Table */}
                    <TabsContent value="all-leads">
                        <Card className="bg-merkad-bg-secondary border-merkad-border">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white">All Leads</CardTitle>
                                    <div className="relative w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-merkad-text-muted" />
                                        <Input
                                            placeholder="Search leads..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-merkad-bg-tertiary border-merkad-border"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Source</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLeads.map((lead) => (
                                            <TableRow key={lead.id}>
                                                <TableCell className="font-medium text-white">{lead.name || 'Unnamed'}</TableCell>
                                                <TableCell className="text-merkad-text-muted">{lead.email || '-'}</TableCell>
                                                <TableCell>
                                                    <span className="text-xs bg-merkad-bg-tertiary px-2 py-1 rounded capitalize">
                                                        {lead.source}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={lead.status} />
                                                </TableCell>
                                                <TableCell className="text-merkad-text-muted">
                                                    {formatDate(lead.createdAt)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {statusColumns.map((col) => (
                                                                <DropdownMenuItem
                                                                    key={col.status}
                                                                    onClick={() => handleStatusChange(lead.id, col.status)}
                                                                >
                                                                    Move to {col.label}
                                                                </DropdownMenuItem>
                                                            ))}
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(lead.id, 'closed-lost')}
                                                                className="text-orange-500"
                                                            >
                                                                Mark as Lost
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    handleDeleteLead(lead.id);
                                                                }}
                                                                className="text-red-500 font-medium cursor-pointer"
                                                            >
                                                                Delete Lead
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredLeads.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-merkad-text-muted py-8">
                                                    {searchTerm ? 'No leads match your search' : 'No leads yet'}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <Card className="bg-merkad-bg-secondary border-merkad-border">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {leads.slice(0, 10).map((lead) => (
                                        <div
                                            key={lead.id}
                                            className="flex items-center gap-4 p-3 bg-merkad-bg-tertiary rounded-lg"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-merkad-purple/20 flex items-center justify-center">
                                                <User className="w-5 h-5 text-merkad-purple" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white text-sm">
                                                    <span className="font-medium">{lead.name || 'Unnamed Lead'}</span>
                                                    {' '}was added as a new lead
                                                </p>
                                                <p className="text-xs text-merkad-text-muted">
                                                    via {lead.source} • {formatDate(lead.createdAt, 'MMM d, yyyy h:mm a')}
                                                </p>
                                            </div>
                                            <StatusBadge status={lead.status} />
                                        </div>
                                    ))}
                                    {leads.length === 0 && (
                                        <p className="text-center text-merkad-text-muted py-8">
                                            No activity yet
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Subscribers Tab */}
                    <TabsContent value="subscribers">
                        <EmailSubscribersTab />
                    </TabsContent>

                    {/* Templates Tab */}
                    <TabsContent value="templates">
                        <EmailTemplatesTab />
                    </TabsContent>

                    {/* Campaigns Tab */}
                    <TabsContent value="campaigns">
                        <EmailCampaignsTab />
                    </TabsContent>

                    {/* Sequences Tab */}
                    <TabsContent value="sequences">
                        <EmailSequencesTab />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
