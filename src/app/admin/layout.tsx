import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/Sidebar';
import './admin.css';

export const metadata = {
    title: 'Admin Dashboard | MerkadAgency',
    description: 'Manage leads and view analytics',
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    if (!session?.user) {
        redirect('/login?callbackUrl=/admin');
    }

    return (
        <div className="admin-layout">
            <AdminSidebar user={session.user} />
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
