import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Trash2, Edit, Eye, Send, RefreshCw } from 'lucide-react';

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    htmlContent: string;
    createdAt: Timestamp | Date;
}

export function EmailTemplatesTab() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        htmlContent: '',
    });

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, 'email_templates'));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as EmailTemplate[];
            setTemplates(data);
        } catch (error) {
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.subject || !formData.htmlContent) return;

        try {
            if (editingTemplate) {
                await updateDoc(doc(db, 'email_templates', editingTemplate.id), {
                    name: formData.name,
                    subject: formData.subject,
                    htmlContent: formData.htmlContent,
                    updatedAt: Timestamp.now(),
                });
                setTemplates(prev => prev.map(t =>
                    t.id === editingTemplate.id
                        ? { ...t, ...formData }
                        : t
                ));
            } else {
                const docRef = await addDoc(collection(db, 'email_templates'), {
                    ...formData,
                    createdAt: Timestamp.now(),
                });
                setTemplates(prev => [...prev, {
                    id: docRef.id,
                    ...formData,
                    createdAt: new Date(),
                }]);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving template:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this template?')) return;
        try {
            await deleteDoc(doc(db, 'email_templates', id));
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const handleEdit = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            subject: template.subject,
            htmlContent: template.htmlContent,
        });
        setShowEditor(true);
    };

    const resetForm = () => {
        setFormData({ name: '', subject: '', htmlContent: '' });
        setEditingTemplate(null);
        setShowEditor(false);
    };

    // Default templates for quick start
    const defaultTemplates = [
        {
            name: 'Welcome Email',
            subject: 'Welcome to MerkadAgency! 🚀',
            htmlContent: `<div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #7c3aed;">Welcome, {{name}}!</h1>
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
        Thank you for joining MerkadAgency. We're excited to help you grow your business.
    </p>
    <a href="https://merkadagency.com/book" 
       style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; 
              border-radius: 8px; text-decoration: none; font-weight: 600;">
        Book a Strategy Call
    </a>
</div>`,
        },
    ];

    return (
        <Card className="bg-merkad-bg-secondary border-merkad-border">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Email Templates ({templates.length})
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button onClick={loadTemplates} variant="outline" size="sm" disabled={loading}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button onClick={() => setShowEditor(true)} size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Template
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {showEditor ? (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Template Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-merkad-bg-tertiary border-merkad-border"
                                required
                            />
                            <Input
                                placeholder="Email Subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="bg-merkad-bg-tertiary border-merkad-border"
                                required
                            />
                        </div>
                        <Textarea
                            placeholder="HTML Content... Use {{name}}, {{email}} for variables"
                            value={formData.htmlContent}
                            onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                            className="bg-merkad-bg-tertiary border-merkad-border min-h-[300px] font-mono text-sm"
                            required
                        />
                        <div className="flex gap-2">
                            <Button type="submit">
                                {editingTemplate ? 'Update Template' : 'Create Template'}
                            </Button>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="grid gap-4">
                        {templates.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-merkad-text-muted mb-4">No templates yet. Create one or use a starter:</p>
                                <div className="flex gap-2 justify-center">
                                    {defaultTemplates.map((t, i) => (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            onClick={() => {
                                                setFormData(t);
                                                setShowEditor(true);
                                            }}
                                        >
                                            Use "{t.name}" Template
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {templates.map((template) => (
                            <div
                                key={template.id}
                                className="flex items-center justify-between p-4 bg-merkad-bg-tertiary rounded-lg"
                            >
                                <div>
                                    <h3 className="text-white font-medium">{template.name}</h3>
                                    <p className="text-sm text-merkad-text-muted">{template.subject}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setPreviewTemplate(template)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(template)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(template.id)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Preview Modal */}
                {previewTemplate && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
                            <div className="p-4 border-b flex items-center justify-between bg-purple-600">
                                <div>
                                    <p className="text-sm text-purple-200">Subject:</p>
                                    <p className="font-medium text-white">{previewTemplate.subject}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setPreviewTemplate(null)}
                                    className="bg-white text-purple-600 hover:bg-purple-100 border-white"
                                >
                                    Close
                                </Button>
                            </div>
                            <div
                                className="p-6"
                                dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
