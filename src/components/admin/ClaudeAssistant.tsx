/**
 * Claude Assistant — Chat panel for the admin dashboard.
 * Collapsible panel that sits at the bottom of every admin page.
 * Queries Firestore data client-side, sends to Cloud Function for AI response.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import {
    getLeads, getClients, getRevenueData,
    getPipelineValue, searchPeople, getApprovalQueue,
    addNoteToClient, updateLeadStatus, convertLeadToClient,
} from '@/lib/claudeDataLayer';
import { ChevronUp, ChevronDown, Send, Loader2, Bot, Sparkles } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SUGGESTED_PROMPTS = [
    "This week's summary",
    "Show cold leads",
    "Pipeline value",
    "Revenue this month",
    "Approval queue",
];

export default function ClaudeAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([{
        role: 'assistant',
        content: `Hi! I have full access to your CRM data. Ask me anything about leads, clients, revenue, or tell me to take an action.\n\nTry clicking a suggestion below 👇`,
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Gather CRM context based on what the user is asking about
    const gatherCRMContext = useCallback(async (userMessage: string) => {
        const msg = userMessage.toLowerCase();
        const context: Record<string, any> = {};

        const tasks: Promise<void>[] = [];

        if (msg.includes('lead') || msg.includes('pipeline') || msg.includes('cold') ||
            msg.includes('summary') || msg.includes('stale') || msg.includes('new lead')) {
            tasks.push(getLeads().then(data => { context.leads = data; }));
        }

        if (msg.includes('client') || msg.includes('summary') || msg.includes('customer')) {
            tasks.push(getClients().then(data => { context.clients = data; }));
        }

        if (msg.includes('revenue') || msg.includes('money') || msg.includes('contract') ||
            msg.includes('summary') || msg.includes('close') || msg.includes('signed') ||
            msg.includes('income') || msg.includes('sales')) {
            tasks.push(getRevenueData().then(data => { context.revenue = data; }));
        }

        if (msg.includes('pipeline') || msg.includes('value') || msg.includes('quote') ||
            msg.includes('summary') || msg.includes('open') || msg.includes('pending')) {
            tasks.push(getPipelineValue().then(data => { context.pipelineValue = data; }));
        }

        if (msg.includes('approval') || msg.includes('queue') || msg.includes('review')) {
            tasks.push(getApprovalQueue().then(data => { context.approvalQueue = data; }));
        }

        // Search for specific person
        const nameMatch = msg.match(/(?:about|find|show|search|look up|who is)\s+([a-z]+ ?[a-z]*)/i);
        if (nameMatch) {
            tasks.push(searchPeople(nameMatch[1].trim()).then(data => { context.searchResults = data; }));
        }

        await Promise.all(tasks);
        return context;
    }, []);

    // Handle actions (writes)
    const handleAction = useCallback(async (userMessage: string, context: Record<string, any>) => {
        const msg = userMessage.toLowerCase();

        // Convert lead to client
        const convertMatch = msg.match(/convert\s+([a-z]+ ?[a-z]*)\s+to\s+client/i);
        if (convertMatch) {
            const name = convertMatch[1].trim();
            const lead = (context.leads as any[])?.find(l =>
                l.name?.toLowerCase().includes(name.toLowerCase())
            );
            if (lead) {
                const result = await convertLeadToClient(lead.id);
                return (result as any).message || (result as any).error;
            }
            return `Could not find lead named "${name}"`;
        }

        // Update lead status
        const statusMatch = msg.match(/mark\s+([a-z]+ ?[a-z]*)\s+as\s+(contacted|qualified|lost|new)/i);
        if (statusMatch) {
            const name = statusMatch[1].trim();
            const newStatus = statusMatch[2];
            const lead = (context.leads as any[])?.find(l =>
                l.name?.toLowerCase().includes(name.toLowerCase())
            );
            if (lead) {
                await updateLeadStatus(lead.id, newStatus);
                return `✅ ${lead.name} marked as ${newStatus}`;
            }
            return `Could not find lead named "${name}"`;
        }

        // Add note
        const noteMatch = msg.match(/add (?:a )?note to ([a-z]+ ?[a-z]*)[:\s]+(.+)/i);
        if (noteMatch) {
            const name = noteMatch[1].trim();
            const note = noteMatch[2].trim();
            const client = (context.clients as any[])?.find(c =>
                c.name?.toLowerCase().includes(name.toLowerCase())
            );
            if (client) {
                await addNoteToClient(client.id, note);
                return `✅ Note added to ${client.name}: "${note}"`;
            }
            return `Could not find client named "${name}"`;
        }

        return null;
    }, []);

    const sendMessage = useCallback(async (text?: string) => {
        const userMessage = text || input;
        if (!userMessage.trim() || loading) return;

        setInput('');
        setLoading(true);

        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);

        try {
            // Pull relevant CRM data
            const crmContext = await gatherCRMContext(userMessage);

            // Check for direct actions
            const actionResult = await handleAction(userMessage, crmContext);
            if (actionResult) {
                crmContext._actionTaken = actionResult;
            }

            // Call Cloud Function proxy to Anthropic
            const claudeChat = httpsCallable(functions, 'claudeAssistantChat');
            const result = await claudeChat({
                message: userMessage,
                crmContext,
                conversationHistory: newMessages.slice(1).map(m => ({
                    role: m.role,
                    content: m.content,
                })),
            });

            const reply = (result.data as any)?.reply || 'Sorry, something went wrong.';

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error('Claude Assistant error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ Something went wrong. Check your connection and try again.',
            }]);
        }

        setLoading(false);
    }, [input, loading, messages, gatherCRMContext, handleAction]);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                height: isOpen ? '420px' : '48px',
                transition: 'height 0.3s ease',
                background: '#0F1220',
                borderTop: '1px solid #5A27FF',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #5A27FF 0%, #7C3AED 100%)',
                    flexShrink: 0,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={18} color="white" />
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                        {isOpen ? 'Claude Assistant' : 'Ask Claude...'}
                    </span>
                    {!isOpen && (
                        <Sparkles size={14} color="#FBCBD5" />
                    )}
                </div>
                {isOpen ? <ChevronDown size={18} color="white" /> : <ChevronUp size={18} color="white" />}
            </div>

            {isOpen && (
                <>
                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    background: msg.role === 'user' ? '#5A27FF' : '#1a1f35',
                                    color: 'white',
                                    padding: '8px 14px',
                                    borderRadius: msg.role === 'user'
                                        ? '18px 18px 4px 18px'
                                        : '18px 18px 18px 4px',
                                    maxWidth: msg.role === 'user' ? '80%' : '85%',
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '13px',
                                    lineHeight: '1.5',
                                }}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div
                                style={{
                                    alignSelf: 'flex-start',
                                    background: '#1a1f35',
                                    color: '#9CA3AF',
                                    padding: '10px 14px',
                                    borderRadius: '18px 18px 18px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '13px',
                                }}
                            >
                                <Loader2 size={14} className="animate-spin" /> Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested prompts — only on first message */}
                    {messages.length === 1 && (
                        <div style={{ padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {SUGGESTED_PROMPTS.map(prompt => (
                                <button
                                    key={prompt}
                                    onClick={() => sendMessage(prompt)}
                                    disabled={loading}
                                    style={{
                                        background: '#1a1f35',
                                        color: '#FBCBD5',
                                        border: '1px solid #2a2f45',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#5A27FF')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2f45')}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                            padding: '10px 16px',
                            borderTop: '1px solid #1a1f35',
                            flexShrink: 0,
                        }}
                    >
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask anything or give a command..."
                            disabled={loading}
                            style={{
                                flex: 1,
                                background: '#1a1f35',
                                border: '1px solid #2a2f45',
                                color: 'white',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = '#5A27FF')}
                            onBlur={e => (e.currentTarget.style.borderColor = '#2a2f45')}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                            style={{
                                background: loading || !input.trim() ? '#3d2a7a' : '#5A27FF',
                                color: 'white',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
