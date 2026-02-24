import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Brain,
    PlusCircle,
    FileText,
    ToggleLeft,
    ToggleRight,
    Trash2,
    Upload,
    X,
    Type,
    Loader2,
} from 'lucide-react';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ============ TYPES ============

interface KBDocument {
    id: string;
    name: string;
    type: 'text' | 'manual';
    content: string;
    status: 'active' | 'inactive';
    uploadedAt: any;
}

// ============ MAIN COMPONENT ============

export function KnowledgeBaseTab() {
    const [docs, setDocs] = useState<KBDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddText, setShowAddText] = useState(false);
    const [newName, setNewName] = useState('');
    const [newContent, setNewContent] = useState('');
    const [saving, setSaving] = useState(false);

    const loadDocs = useCallback(async () => {
        setLoading(true);
        try {
            const ref = collection(db, 'knowledgeBase');
            const q = query(ref, orderBy('uploadedAt', 'desc'));
            const snapshot = await getDocs(q);
            setDocs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as KBDocument)));
        } catch (err) {
            console.error(err);
            toast.error('Failed to load knowledge base');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadDocs(); }, [loadDocs]);

    const handleAdd = async () => {
        if (!newName.trim() || !newContent.trim()) {
            toast.error('Name and content are required');
            return;
        }
        setSaving(true);
        try {
            // Chunk content
            const chunks = chunkText(newContent.trim(), 1000);

            await addDoc(collection(db, 'knowledgeBase'), {
                name: newName.trim(),
                type: 'manual',
                content: newContent.trim(),
                status: 'active',
                chunks: chunks.map((text, i) => ({ chunkId: `chunk_${i}`, text, order: i })),
                uploadedAt: serverTimestamp(),
            });

            toast.success('Document added to Knowledge Base');
            setNewName('');
            setNewContent('');
            setShowAddText(false);
            loadDocs();
        } catch (err) {
            console.error(err);
            toast.error('Failed to add document');
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (docItem: KBDocument) => {
        const newStatus = docItem.status === 'active' ? 'inactive' : 'active';
        try {
            await updateDoc(doc(db, 'knowledgeBase', docItem.id), { status: newStatus });
            toast.success(`${docItem.name} set to ${newStatus}`);
            loadDocs();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (docItem: KBDocument) => {
        if (!confirm(`Delete "${docItem.name}"? This cannot be undone.`)) return;
        try {
            await deleteDoc(doc(db, 'knowledgeBase', docItem.id));
            toast.success('Document deleted');
            loadDocs();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const activeCount = docs.filter(d => d.status === 'active').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Brain className="w-6 h-6 text-merkad-purple" /> Knowledge Base
                    </h2>
                    <p className="text-merkad-text-muted text-sm mt-1">
                        Everything your AI agents know about MerkadAgency lives here
                        {activeCount > 0 && <span className="ml-2 text-green-400">· {activeCount} active</span>}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={() => setShowAddText(true)}
                    className="bg-merkad-purple hover:bg-merkad-purple-light text-white"
                    disabled={showAddText}
                >
                    <Type className="w-4 h-4 mr-2" /> Add Text Block
                </Button>
            </div>

            {/* Add Text Form */}
            {showAddText && (
                <Card className="bg-merkad-bg-secondary border-merkad-purple/30">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-medium">Add Knowledge Document</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddText(false)}>
                                <X className="w-4 h-4 text-merkad-text-muted" />
                            </Button>
                        </div>
                        <Input
                            placeholder="Document name (e.g., Services & Pricing Guide)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-merkad-bg-tertiary border-merkad-border text-white"
                        />
                        <Textarea
                            placeholder="Paste your content here... Include all details your AI agents should know about."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            rows={12}
                            className="bg-merkad-bg-tertiary border-merkad-border text-white resize-none font-mono text-sm"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-merkad-text-muted">
                                {newContent.length > 0 && `~${Math.ceil(newContent.length / 4)} tokens · ${chunkText(newContent, 1000).length} chunks`}
                            </span>
                            <Button onClick={handleAdd} disabled={saving || !newName.trim() || !newContent.trim()}
                                className="bg-merkad-purple hover:bg-merkad-purple-light text-white">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                {saving ? 'Saving...' : 'Save to Knowledge Base'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Documents List */}
            {loading ? (
                <p className="text-merkad-text-muted text-center py-8">Loading knowledge base...</p>
            ) : docs.length === 0 ? (
                <Card className="bg-merkad-bg-secondary border-merkad-border">
                    <CardContent className="py-12 text-center">
                        <Brain className="w-12 h-12 text-merkad-purple mx-auto mb-4 opacity-40" />
                        <h3 className="text-white text-lg font-medium mb-2">No documents yet</h3>
                        <p className="text-merkad-text-muted text-sm">
                            Add your services guide, pricing info, brand voice document, case studies, and FAQs.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {docs.map((docItem) => (
                        <Card key={docItem.id} className="bg-merkad-bg-secondary border-merkad-border hover:border-merkad-border/80 transition-colors">
                            <CardContent className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <FileText className="w-5 h-5 text-merkad-purple shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-white font-medium text-sm truncate">{docItem.name}</p>
                                        <p className="text-xs text-merkad-text-muted">
                                            {docItem.type === 'manual' ? 'Text block' : docItem.type}
                                            {docItem.content && ` · ~${Math.ceil(docItem.content.length / 4)} tokens`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Badge className={docItem.status === 'active'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                    }>
                                        {docItem.status === 'active' ? '● Active' : '○ Inactive'}
                                    </Badge>
                                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(docItem)}
                                        className="text-merkad-text-muted hover:text-white h-8 w-8 p-0"
                                        title={docItem.status === 'active' ? 'Deactivate' : 'Activate'}>
                                        {docItem.status === 'active'
                                            ? <ToggleRight className="w-4 h-4 text-green-400" />
                                            : <ToggleLeft className="w-4 h-4" />
                                        }
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(docItem)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============ CHUNKING UTILITY ============

function chunkText(text: string, maxTokens: number): string[] {
    const paragraphs = text.split('\n\n');
    const chunks: string[] = [];
    let current = '';
    const maxChars = maxTokens * 4; // ~4 chars per token

    for (const para of paragraphs) {
        if ((current + para).length > maxChars) {
            if (current) chunks.push(current.trim());
            current = para;
        } else {
            current += (current ? '\n\n' : '') + para;
        }
    }
    if (current) chunks.push(current.trim());

    return chunks;
}
