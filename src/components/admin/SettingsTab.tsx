import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Library,
    Calculator,
    Bot,
    Megaphone,
    BookOpen,
    Users,
    Send,
    FileText,
    Workflow,
    ChevronRight,
    Settings as SettingsIcon,
    Lock,
} from 'lucide-react';

// ============ LAZY IMPORTS ============
// These are imported lazily because they're existing components being moved here

import ServiceLibrary from '@/pages/admin/ServiceLibrary';
import { PricingCalculator } from '@/components/admin/pricing/PricingCalculator';
import { AdminAI } from '@/pages/admin/ai/AdminAI';
import { EmailSubscribersTab } from '@/components/admin/EmailSubscribersTab';
import { EmailTemplatesTab } from '@/components/admin/EmailTemplatesTab';
import { EmailCampaignsTab } from '@/components/admin/EmailCampaignsTab';
import { EmailSequencesTab } from '@/components/admin/EmailSequencesTab';
import { KnowledgeBaseTab } from '@/components/admin/KnowledgeBaseTab';

// ============ TYPES ============

type SettingsSection =
    | 'menu'
    | 'services'
    | 'pricing'
    | 'ai-agents'
    | 'marketing'
    | 'marketing-subscribers'
    | 'marketing-campaigns'
    | 'marketing-templates'
    | 'marketing-sequences'
    | 'knowledge-base';

interface MenuItem {
    id: SettingsSection;
    label: string;
    description: string;
    icon: typeof Library;
    children?: { id: SettingsSection; label: string; icon: typeof Library }[];
    comingSoon?: boolean;
}

const SETTINGS_MENU: MenuItem[] = [
    { id: 'services', label: 'Service Library', description: 'Manage your service catalog and pricing', icon: Library },
    { id: 'pricing', label: 'Pricing Templates', description: 'Build quotes with the pricing calculator', icon: Calculator },
    { id: 'ai-agents', label: 'AI Agents', description: 'Configure automated AI agents', icon: Bot },
    {
        id: 'marketing', label: 'Marketing', description: 'Email campaigns, subscribers, and sequences', icon: Megaphone,
        children: [
            { id: 'marketing-subscribers', label: 'Subscribers', icon: Users },
            { id: 'marketing-campaigns', label: 'Campaigns', icon: Send },
            { id: 'marketing-templates', label: 'Templates', icon: FileText },
            { id: 'marketing-sequences', label: 'Sequences', icon: Workflow },
        ],
    },
    { id: 'knowledge-base', label: 'Knowledge Base', description: 'AI knowledge and training data', icon: BookOpen },
];

// ============ MAIN COMPONENT ============

export function SettingsTab() {
    const [activeSection, setActiveSection] = useState<SettingsSection>('menu');

    const renderContent = () => {
        switch (activeSection) {
            case 'services': return <ServiceLibrary />;
            case 'pricing': return <PricingCalculator />;
            case 'ai-agents': return <AdminAI />;
            case 'marketing-subscribers': return <EmailSubscribersTab />;
            case 'marketing-campaigns': return <EmailCampaignsTab />;
            case 'marketing-templates': return <EmailTemplatesTab />;
            case 'marketing-sequences': return <EmailSequencesTab />;
            case 'knowledge-base': return <KnowledgeBaseTab />;
            default: return null;
        }
    };

    // Show sub-page
    if (activeSection !== 'menu' && activeSection !== 'marketing') {
        const sectionLabel =
            SETTINGS_MENU.find(m => m.id === activeSection)?.label ||
            SETTINGS_MENU.flatMap(m => m.children || []).find(c => c.id === activeSection)?.label ||
            'Settings';

        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setActiveSection('menu')} className="text-merkad-text-muted hover:text-white text-sm">
                        ← Settings
                    </Button>
                    <span className="text-merkad-text-muted">/</span>
                    <span className="text-white font-medium">{sectionLabel}</span>
                </div>
                {renderContent()}
            </div>
        );
    }

    // Marketing sub-menu
    if (activeSection === 'marketing') {
        const marketing = SETTINGS_MENU.find(m => m.id === 'marketing')!;
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setActiveSection('menu')} className="text-merkad-text-muted hover:text-white text-sm">
                        ← Settings
                    </Button>
                    <span className="text-merkad-text-muted">/</span>
                    <span className="text-white font-medium">Marketing</span>
                </div>
                <div className="grid gap-2">
                    {marketing.children!.map((child) => {
                        const Icon = child.icon;
                        return (
                            <Card key={child.id}
                                className="bg-merkad-bg-secondary border-merkad-border hover:border-merkad-purple/40 cursor-pointer transition-colors"
                                onClick={() => setActiveSection(child.id)}>
                                <CardContent className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-merkad-purple/10 flex items-center justify-center">
                                            <Icon className="w-4 h-4 text-merkad-purple" />
                                        </div>
                                        <span className="text-white font-medium text-sm">{child.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-merkad-text-muted" />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Main settings menu
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <SettingsIcon className="w-6 h-6 text-merkad-purple" /> Settings
            </h2>

            <div className="grid gap-2">
                {SETTINGS_MENU.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Card key={item.id}
                            className={`bg-merkad-bg-secondary border-merkad-border transition-colors ${item.comingSoon ? 'opacity-50' : 'hover:border-merkad-purple/40 cursor-pointer'
                                }`}
                            onClick={() => !item.comingSoon && setActiveSection(item.children ? 'marketing' : item.id)}>
                            <CardContent className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-merkad-purple/10 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-merkad-purple" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{item.label}</p>
                                        <p className="text-xs text-merkad-text-muted">{item.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.comingSoon && (
                                        <span className="text-xs text-merkad-text-muted bg-merkad-bg-tertiary px-2 py-1 rounded flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> Phase 2
                                        </span>
                                    )}
                                    <ChevronRight className="w-4 h-4 text-merkad-text-muted" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
