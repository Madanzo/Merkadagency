import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    getKnowledgeDocs,
    createKnowledgeDoc,
    deleteKnowledgeDoc,
    KnowledgeDoc,
    CreateKnowledgeDocData
} from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Trash2, FileText, Upload, RefreshCw } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function KnowledgeBase() {
    const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<CreateKnowledgeDocData>>({
        title: '',
        content: '',
        category: 'general',
        agentType: 'both',
        language: 'en',
        isActive: true
    });

    const loadDocs = async () => {
        setLoading(true);
        try {
            const data = await getKnowledgeDocs();
            setDocs(data);
        } catch (error) {
            console.error("Failed to load docs:", error);
            toast.error("Failed to load knowledge base");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocs();
    }, []);

    const handleCreate = async () => {
        if (!formData.title || !formData.content) {
            toast.error("Title and Content are required");
            return;
        }

        try {
            await createKnowledgeDoc({
                title: formData.title,
                content: formData.content,
                category: formData.category || 'general',
                agentType: formData.agentType as any || 'both',
                language: formData.language as any || 'en',
                isActive: true,
                metadata: {
                    source: 'manual',
                    uploadedBy: 'admin' // Could get user ID if needed
                }
            } as any);

            toast.success("Document created");
            setIsCreateOpen(false);
            setFormData({
                title: '',
                content: '',
                category: 'general',
                agentType: 'both',
                language: 'en',
                isActive: true
            });
            loadDocs();
        } catch (error) {
            console.error("Create failed:", error);
            toast.error("Failed to create document");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete the document from the knowledge base.")) return;
        try {
            await deleteKnowledgeDoc(id);
            toast.success("Document deleted");
            loadDocs();
        } catch (error) {
            toast.error("Failed to delete document");
        }
    };

    const filteredDocs = docs.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Knowledge Base</h2>
                    <p className="text-merkad-text-muted">Manage documents used by AI agents</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadDocs} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-merkad-purple hover:bg-merkad-purple/90">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-merkad-bg-secondary border-merkad-border text-white max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add Knowledge Document</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Title</Label>
                                    <Input
                                        placeholder="e.g. Roof Inspection Process"
                                        className="bg-merkad-bg-tertiary border-merkad-border"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <Input
                                            placeholder="faq, pricing, services..."
                                            className="bg-merkad-bg-tertiary border-merkad-border"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Language</Label>
                                        <Select
                                            value={formData.language}
                                            onValueChange={v => setFormData({ ...formData, language: v as any })}
                                        >
                                            <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="es">Spanish</SelectItem>
                                                <SelectItem value="both">Both</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Agent Type</Label>
                                    <Select
                                        value={formData.agentType}
                                        onValueChange={v => setFormData({ ...formData, agentType: v as any })}
                                    >
                                        <SelectTrigger className="bg-merkad-bg-tertiary border-merkad-border">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="support">Support Only</SelectItem>
                                            <SelectItem value="sales">Sales Only</SelectItem>
                                            <SelectItem value="both">Both Agents</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Content</Label>
                                    <Textarea
                                        placeholder="Paste document content here..."
                                        className="bg-merkad-bg-tertiary border-merkad-border min-h-[200px]"
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreate} className="bg-merkad-purple hover:bg-merkad-purple/90">Save Document</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-merkad-bg-secondary p-4 rounded-lg border border-merkad-border">
                <Search className="w-5 h-5 text-merkad-text-muted" />
                <Input
                    placeholder="Search documents by title or category..."
                    className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-merkad-text-muted"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <Card className="bg-merkad-bg-secondary border-merkad-border">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-merkad-border hover:bg-transparent">
                                <TableHead className="text-merkad-text-muted">Title</TableHead>
                                <TableHead className="text-merkad-text-muted">Category</TableHead>
                                <TableHead className="text-merkad-text-muted">Agent</TableHead>
                                <TableHead className="text-merkad-text-muted">Language</TableHead>
                                <TableHead className="text-right text-merkad-text-muted">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.map((doc) => (
                                <TableRow key={doc.id} className="border-merkad-border hover:bg-merkad-bg-tertiary">
                                    <TableCell className="font-medium text-white">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-merkad-purple" />
                                            {doc.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-merkad-bg-tertiary text-merkad-text-muted border-merkad-border">
                                            {doc.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize text-white">{doc.agentType}</TableCell>
                                    <TableCell className="uppercase text-white">{doc.language}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                            onClick={() => handleDelete(doc.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredDocs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-merkad-text-muted">
                                        No documents found. Upload or create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
