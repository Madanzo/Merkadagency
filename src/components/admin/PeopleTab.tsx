import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Users,
    Search,
    Plus,
    UserPlus,
    Filter,
} from 'lucide-react';
import { getAllPeople, STATUS_CONFIG, type Person, type PersonType } from '@/lib/peopleService';
import { PersonProfile } from './PersonProfile';

// ============ FILTER TYPES ============

type FilterOption = 'all' | 'lead' | 'client' | 'converted';

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'lead', label: 'Leads' },
    { value: 'client', label: 'Clients' },
    { value: 'converted', label: 'Converted' },
];

// ============ HELPERS ============

const formatDate = (timestamp: any): string => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ============ ADD PERSON FORM ============

function AddPersonForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
    const [form, setForm] = useState({ name: '', business: '', email: '', phone: '' });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name) { toast.error('Name is required'); return; }
        setSaving(true);
        try {
            const { createClient } = await import('@/lib/clients');
            await createClient({
                name: form.name,
                business: form.business,
                email: form.email,
                phone: form.phone,
                industry: '',
                website: '',
                notes: '',
            });
            toast.success('Person added!');
            onSave();
        } catch { toast.error('Failed to add person'); }
        finally { setSaving(false); }
    };

    return (
        <Card className="bg-merkad-bg-secondary border-merkad-border mb-4">
            <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="flex gap-3 items-end flex-wrap">
                    <Input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white w-48" />
                    <Input placeholder="Business" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white w-44" />
                    <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white w-52" />
                    <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="bg-merkad-bg-tertiary border-merkad-border text-white w-40" />
                    <Button type="submit" disabled={saving} className="bg-merkad-purple hover:bg-merkad-purple-light text-white">
                        {saving ? 'Adding...' : 'Add'}
                    </Button>
                    <Button type="button" variant="ghost" onClick={onCancel} className="text-merkad-text-muted hover:text-white">Cancel</Button>
                </form>
            </CardContent>
        </Card>
    );
}

// ============ MAIN COMPONENT ============

export function PeopleTab() {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterOption>('all');
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    const loadPeople = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllPeople();
            setPeople(data);
        } catch { toast.error('Failed to load people'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { loadPeople(); }, [loadPeople]);

    // Filter + search
    const filtered = people.filter((p) => {
        // Filter by type
        if (filter !== 'all' && p.type !== filter) return false;

        // Search
        if (search) {
            const term = search.toLowerCase();
            return (
                p.name.toLowerCase().includes(term) ||
                p.business.toLowerCase().includes(term) ||
                p.email.toLowerCase().includes(term) ||
                p.phone.toLowerCase().includes(term)
            );
        }
        return true;
    });

    // Show profile
    if (selectedPerson) {
        return (
            <PersonProfile
                person={selectedPerson}
                onBack={() => { setSelectedPerson(null); loadPeople(); }}
                onRefresh={loadPeople}
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-merkad-purple" /> People
                </h2>
                <Button onClick={() => setShowAdd(!showAdd)} className="bg-merkad-purple hover:bg-merkad-purple-light text-white">
                    <UserPlus className="w-4 h-4 mr-2" /> Add Person
                </Button>
            </div>

            {/* Add Person Form */}
            {showAdd && (
                <AddPersonForm
                    onSave={() => { setShowAdd(false); loadPeople(); }}
                    onCancel={() => setShowAdd(false)}
                />
            )}

            {/* Filter + Search */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Filter pills */}
                <div className="flex bg-merkad-bg-secondary rounded-lg p-1 border border-merkad-border">
                    {FILTER_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === opt.value
                                    ? 'bg-merkad-purple text-white shadow-sm'
                                    : 'text-merkad-text-muted hover:text-white'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-merkad-text-muted" />
                    <Input
                        placeholder="Search by name, business, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-merkad-bg-secondary border-merkad-border text-white"
                    />
                </div>

                {/* Count */}
                <span className="text-sm text-merkad-text-muted">
                    {filtered.length} {filter === 'all' ? 'people' : filter + 's'}
                </span>
            </div>

            {/* Table */}
            {loading ? (
                <Card className="bg-merkad-bg-secondary border-merkad-border">
                    <CardContent className="py-12 text-center text-merkad-text-muted">Loading...</CardContent>
                </Card>
            ) : filtered.length === 0 ? (
                <Card className="bg-merkad-bg-secondary border-merkad-border">
                    <CardContent className="py-12 text-center text-merkad-text-muted">
                        {search ? 'No results match your search.' : 'No people yet.'}
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-merkad-bg-secondary border-merkad-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-merkad-border hover:bg-transparent">
                                <TableHead className="text-merkad-text-muted">Name</TableHead>
                                <TableHead className="text-merkad-text-muted">Business</TableHead>
                                <TableHead className="text-merkad-text-muted">Email</TableHead>
                                <TableHead className="text-merkad-text-muted">Phone</TableHead>
                                <TableHead className="text-merkad-text-muted">Status</TableHead>
                                <TableHead className="text-merkad-text-muted text-right">Last Activity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((person) => {
                                const statusConf = STATUS_CONFIG[person.status] || STATUS_CONFIG.new;
                                return (
                                    <TableRow
                                        key={`${person.type}-${person.id}`}
                                        className="border-merkad-border cursor-pointer hover:bg-merkad-bg-tertiary/50 transition-colors"
                                        onClick={() => setSelectedPerson(person)}
                                    >
                                        <TableCell className="font-medium text-white">{person.name || '—'}</TableCell>
                                        <TableCell className="text-merkad-text-secondary">{person.business || '—'}</TableCell>
                                        <TableCell className="text-merkad-text-secondary">{person.email || '—'}</TableCell>
                                        <TableCell className="text-merkad-text-muted">{person.phone || '—'}</TableCell>
                                        <TableCell>
                                            <Badge className={statusConf.color}>{statusConf.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-merkad-text-muted text-sm">
                                            {formatDate(person.lastActivity)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
