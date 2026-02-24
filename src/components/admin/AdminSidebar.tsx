import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Workflow,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// PHASE 1 ARCHIVED — Old sidebar had 11 items:
// Dashboard, Leads, Pipeline, Activity, AI Agents, Pricing, Service Library, Clients, Marketing (4 sub-tabs)
// Now consolidated to 5 items: Dashboard, People, Pipeline, Inbox, Settings

interface AdminSidebarProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export function AdminSidebar({ currentTab, onTabChange }: AdminSidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const { signOut } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'people', label: 'People', icon: Users },
        { id: 'pipeline', label: 'Pipeline', icon: Workflow },
        { id: 'inbox', label: 'Inbox', icon: MessageSquare },
        { divider: true },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div
            className={`
                relative flex flex-col h-screen bg-merkad-bg-secondary/80 backdrop-blur-md border-r border-merkad-border transition-all duration-300
                ${collapsed ? 'w-20' : 'w-64'}
            `}
        >
            {/* Header / Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-merkad-border/50">
                {!collapsed && (
                    <span className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-merkad-text-secondary">
                        Admin
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto text-merkad-text-muted hover:text-white"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
                {menuItems.map((item, idx) => {
                    if (item.divider) {
                        return <div key={idx} className="my-2 border-t border-merkad-border/30 mx-2" />;
                    }

                    const Icon = item.icon as any;
                    const isActive = currentTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id!)}
                            className={`
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                                ${isActive
                                    ? 'bg-merkad-purple/20 text-white shadow-glow-sm border border-merkad-purple/30'
                                    : 'text-merkad-text-muted hover:bg-merkad-bg-tertiary hover:text-white'
                                }
                                ${collapsed ? 'justify-center' : ''}
                            `}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon
                                size={20}
                                className={`transition-colors ${isActive ? 'text-merkad-purple' : 'group-hover:text-merkad-purple-light'}`}
                            />
                            {!collapsed && (
                                <span className="font-medium text-sm truncate">{item.label}</span>
                            )}
                            {isActive && !collapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-merkad-purple shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-merkad-border/50">
                <button
                    onClick={signOut}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors
                        ${collapsed ? 'justify-center' : ''}
                    `}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </div>
    );
}
