import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MessageSquare, Settings2, ShieldCheck } from 'lucide-react';
import { KnowledgeBase } from './KnowledgeBase';
import { Conversations } from './Conversations';
import { AgentConfig } from './AgentConfig';
import { ApprovalQueue } from './ApprovalQueue';

export function AdminAI() {
    return (
        <div className="space-y-6">
            <div className="bg-merkad-bg-secondary p-6 rounded-xl border border-merkad-border">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">AI Agent Management</h2>
                    <p className="text-merkad-text-muted">Configure your Support & Sales agents, train them with documents, and monitor conversations.</p>
                </div>

                <Tabs defaultValue="knowledge" className="w-full">
                    <TabsList className="bg-merkad-bg-tertiary border border-merkad-border mb-6">
                        <TabsTrigger value="knowledge" className="gap-2">
                            <BookOpen className="w-4 h-4" />
                            Knowledge Base
                        </TabsTrigger>
                        <TabsTrigger value="conversations" className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Conversations
                        </TabsTrigger>
                        <TabsTrigger value="approval" className="gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Approval Queue
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings2 className="w-4 h-4" />
                            Agent Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="knowledge">
                        <KnowledgeBase />
                    </TabsContent>

                    <TabsContent value="conversations">
                        <Conversations />
                    </TabsContent>

                    <TabsContent value="approval">
                        <ApprovalQueue />
                    </TabsContent>

                    <TabsContent value="settings">
                        <AgentConfig />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
