import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute - Wraps admin routes requiring authentication
 * - If not authenticated → redirect to /admin/login
 * - If authenticated but not whitelisted → show Access Denied
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, isAllowed, signOut } = useAuth();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-merkad-bg-primary flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-merkad-purple" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Show access denied if not whitelisted
    if (!isAllowed) {
        return (
            <div className="min-h-screen bg-merkad-bg-primary flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">
                        Access Denied
                    </h1>
                    <p className="text-merkad-text-muted mb-6">
                        Your email ({user.email}) is not authorized to access the admin dashboard.
                    </p>
                    <button
                        onClick={signOut}
                        className="px-6 py-2 bg-merkad-bg-tertiary text-white rounded-lg hover:bg-merkad-bg-elevated transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    // User is authenticated and whitelisted
    return <>{children}</>;
}
