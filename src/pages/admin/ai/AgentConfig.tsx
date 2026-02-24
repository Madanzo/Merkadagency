import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAgentConfigs, updateAgentConfig, AIAgent } from '@/lib/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Save } from 'lucide-react';

export function AgentConfig() {
    const [agents, setAgents] = useState<Record<string, AIAgent>>({});
    const [loading, setLoading] = useState(true);

    const loadAgents = async () => {
        setLoading(true);
        try {
            const list = await getAgentConfigs();
            const map: Record<string, AIAgent> = {};

            // Defaults if not found
            if (!list.find(a => a.id === 'support')) {
                map.support = {
                    id: 'support',
                    name: 'Maria - Support',
                    isActive: true,
                    personality: '',
                    goals: [],
                    responseSettings: { autoSend: false, maxResponseTime: 60, typingDelay: true }
                };
            }
            if (!list.find(a => a.id === 'sales')) {
                map.sales = {
                    id: 'sales',
                    name: 'Carlos - Sales',
                    isActive: true,
                    personality: '',
                    goals: [],
                    responseSettings: { autoSend: false, maxResponseTime: 60, typingDelay: true }
                };
            }

            list.forEach(a => map[a.id] = a);
            setAgents(map);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load agent configs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAgents();
    }, []);

    const handleSave = async (id: string) => {
        try {
            await updateAgentConfig(id, agents[id]);
            toast.success("Agent configuration saved");
        } catch (error) {
            toast.error("Failed to save configuration");
        }
    };

    const updateAgent = (id: string, updates: Partial<AIAgent>) => {
        setAgents(prev => ({
            ...prev,
            [id]: { ...prev[id], ...updates }
        }));
    };

    const updateResponseSettings = (id: string, settings: Partial<AIAgent['responseSettings']>) => {
        setAgents(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                responseSettings: { ...prev[id].responseSettings, ...settings }
            }
        }));
    };

    if (loading && Object.keys(agents).length === 0) {
        return <div className="p-8 text-center text-merkad-text-muted">Loading configurations...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Agent Settings</h2>
                    <p className="text-merkad-text-muted">Configure behavior for Support and Sales agents</p>
                </div>
                <Button variant="outline" onClick={loadAgents} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <Tabs defaultValue="support" className="w-full">
                <TabsList className="bg-merkad-bg-tertiary border border-merkad-border mb-6">
                    <TabsTrigger value="support">Maria (Support)</TabsTrigger>
                    <TabsTrigger value="sales">Carlos (Sales)</TabsTrigger>
                </TabsList>

                {['support', 'sales'].map((id) => {
                    const agent = agents[id];
                    if (!agent) return null;

                    return (
                        <TabsContent key={id} value={id}>
                            <Card className="bg-merkad-bg-secondary border-merkad-border">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-white">{agent.name}</CardTitle>
                                            <CardDescription className="text-merkad-text-muted">
                                                {id === 'support' ? 'Handles customer service inquiries' : 'Focuses on lead conversion'}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id={`${id}-active`}
                                                checked={agent.isActive}
                                                onCheckedChange={(checked) => updateAgent(id, { isActive: checked })}
                                            />
                                            <Label htmlFor={`${id}-active`} className="text-white">Active</Label>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Personality / System Message Overrides */}
                                    <div className="space-y-2">
                                        <Label className="text-white">Personality / Custom Instructions</Label>
                                        <Textarea
                                            placeholder="Add custom instructions to override or append to system prompt..."
                                            className="bg-merkad-bg-tertiary border-merkad-border min-h-[100px]"
                                            value={agent.personality || ''}
                                            onChange={(e) => updateAgent(id, { personality: e.target.value })}
                                        />
                                    </div>

                                    {/* Settings */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4 border border-merkad-border p-4 rounded-lg">
                                            <h4 className="font-medium text-white mb-2">Response Settings</h4>

                                            <div className="flex items-center justify-between">
                                                <Label className="text-white">Auto-Send Responses</Label>
                                                <Switch
                                                    checked={agent.responseSettings.autoSend}
                                                    onCheckedChange={(c) => updateResponseSettings(id, { autoSend: c })}
                                                />
                                            </div>
                                            <p className="text-xs text-merkad-text-muted">
                                                If disabled, AI responses will go to Approval Queue first.
                                            </p>

                                            <div className="flex items-center justify-between mt-4">
                                                <Label className="text-white">Typing Delay (SMS)</Label>
                                                <Switch
                                                    checked={agent.responseSettings.typingDelay}
                                                    onCheckedChange={(c) => updateResponseSettings(id, { typingDelay: c })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 border border-merkad-border p-4 rounded-lg">
                                            <h4 className="font-medium text-white mb-2">Escalation Rules</h4>
                                            <p className="text-sm text-merkad-text-muted">
                                                Keywords that trigger human handoff:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {['lawyer', 'sue', 'manager', 'human', 'complain'].map(k => (
                                                    <Badge key={k} variant="secondary" className="bg-merkad-bg-tertiary">
                                                        {k}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button onClick={() => handleSave(id)} className="bg-merkad-purple hover:bg-merkad-purple/90">
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}
