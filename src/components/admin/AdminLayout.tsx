import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export function AdminLayout({ children, currentTab, onTabChange }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen bg-merkad-bg-primary text-white overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-merkad-purple/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-merkad-purple-light/5 rounded-full blur-[80px]" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02]" />
            </div>

            {/* Sidebar */}
            <div className="relative z-20 shrink-0">
                <AdminSidebar currentTab={currentTab} onTabChange={onTabChange} />
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex-1 h-screen overflow-y-auto overflow-x-hidden">
                <div className="container-custom py-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
