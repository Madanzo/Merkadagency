import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db, functions } from '@/lib/firebase'; // Ensure functions is exported from firebase lib
import { httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Plus, Trash2, Tag, Mail, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Subscriber {
    id: string;
    email: string;
    name: string;
    source: string;
    tags: string[];
    createdAt: Timestamp | Date;
}

const formatDate = (dateValue: Timestamp | Date | string | number | null | undefined) => {
    if (!dateValue) return 'N/A';
    try {
        if (dateValue instanceof Timestamp) {
            return format(dateValue.toDate(), 'MMM d, yyyy');
        }
        return format(new Date(dateValue), 'MMM d, yyyy');
    } catch {
        return 'Invalid Date';
    }
};

export function EmailSubscribersTab() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');

    const loadSubscribers = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'subscribers'));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Subscriber[];
            setSubscribers(data);
        } catch (error) {
            console.error('Error loading subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscribers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;
        try {
            await deleteDoc(doc(db, 'subscribers', id));
            setSubscribers(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting subscriber:', error);
        }
    };

    const handleAddTag = async (id: string, tag: string) => {
        try {
            const subscriber = subscribers.find(s => s.id === id);
            if (!subscriber) return;
            const newTags = [...(subscriber.tags || []), tag];
            await updateDoc(doc(db, 'subscribers', id), { tags: newTags });
            setSubscribers(prev => prev.map(s =>
                s.id === id ? { ...s, tags: newTags } : s
            ));
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    const handleAddSubscriber = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return;
        try {
            const docRef = await addDoc(collection(db, 'subscribers'), {
                email: newEmail,
                name: newName || '',
                source: 'manual',
                tags: [],
                createdAt: Timestamp.now(),
                sequences: [],
            });
            setSubscribers(prev => [...prev, {
                id: docRef.id,
                email: newEmail,
                name: newName || '',
                source: 'manual',
                tags: [],
                createdAt: new Date(),
            }]);
            setNewEmail('');
            setNewName('');
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding subscriber:', error);
        }
    };

    const handleStartSequence = async (email: string, sequenceName: string) => {
        if (!confirm(`Are you sure you want to start the ${sequenceName} sequence for this subscriber?`)) return;

        try {
            const startSubscriberSequence = httpsCallable(functions, 'startSubscriberSequence');
            await startSubscriberSequence({ email, sequenceName });
            alert('Sequence started successfully!');
            // Refresh subscribers to show any changes
            loadSubscribers();
        } catch (error) {
            console.error('Error starting sequence:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to start sequence: ${message}`);
        }
    };

    const filteredSubscribers = subscribers.filter(s =>
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="bg-merkad-bg-secondary border-merkad-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email Subscribers ({subscribers.length})
                    </CardTitle>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-merkad-text-muted" />
                            <Input
                                placeholder="Search subscribers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-merkad-bg-tertiary border-merkad-border"
                            />
                        </div>
                        <Button onClick={loadSubscribers} variant="outline" size="sm" disabled={loading}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add
                        </Button>
                    </div>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddSubscriber} className="flex gap-3 mt-4 p-4 bg-merkad-bg-tertiary rounded-lg">
                        <Input
                            placeholder="Email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="bg-merkad-bg-primary border-merkad-border"
                            required
                        />
                        <Input
                            placeholder="Name (optional)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-merkad-bg-primary border-merkad-border"
                        />
                        <Button type="submit">Add Subscriber</Button>
                    </form>
                )}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubscribers.map((subscriber) => (
                            <TableRow key={subscriber.id}>
                                <TableCell className="font-medium text-white">{subscriber.email}</TableCell>
                                <TableCell className="text-merkad-text-muted">{subscriber.name || '-'}</TableCell>
                                <TableCell>
                                    <span className="text-xs bg-merkad-bg-tertiary px-2 py-1 rounded capitalize">
                                        {subscriber.source}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1 flex-wrap">
                                        {(subscriber.tags || []).map((tag, i) => (
                                            <span key={i} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-merkad-text-muted">
                                    {formatDate(subscriber.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                                const tag = prompt('Enter tag name:');
                                                if (tag) handleAddTag(subscriber.id, tag);
                                            }}>
                                                <Tag className="w-4 h-4 mr-2" />
                                                Add Tag
                                            </DropdownMenuItem>

                                            {/* Start Sequence Options */}
                                            <DropdownMenuItem onClick={() => handleStartSequence(subscriber.email, 'post-booking')}>
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Start Post-Booking
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStartSequence(subscriber.email, 'reengagement')}>
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Start Re-Engagement
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStartSequence(subscriber.email, 'onboarding')}>
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Start Onboarding
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => handleDelete(subscriber.id)}
                                                className="text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredSubscribers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-merkad-text-muted py-8">
                                    {searchTerm ? 'No subscribers match your search' : 'No subscribers yet'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
