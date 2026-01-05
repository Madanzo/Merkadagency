import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn } from 'lucide-react';

export default function AdminLogin() {
    const { user, loading, isAllowed, signIn } = useAuth();
    const navigate = useNavigate();

    // Redirect to dashboard if already authenticated and allowed
    useEffect(() => {
        if (user && isAllowed) {
            navigate('/admin', { replace: true });
        }
    }, [user, isAllowed, navigate]);

    return (
        <Layout>
            <section className="pt-32 pb-20 lg:pt-40 lg:pb-24 min-h-screen flex items-center justify-center">
                <div className="container-custom max-w-md">
                    <Card className="bg-merkad-bg-secondary border-merkad-border">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 rounded-full bg-merkad-purple/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🔐</span>
                            </div>
                            <CardTitle className="text-2xl font-display text-white">
                                Admin Login
                            </CardTitle>
                            <CardDescription>
                                Sign in with your Google account to access the dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-merkad-purple" />
                                </div>
                            ) : user && !isAllowed ? (
                                <div className="text-center">
                                    <p className="text-yellow-500 mb-4">
                                        Your account ({user.email}) is not authorized.
                                    </p>
                                    <Button
                                        onClick={signIn}
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        Try Different Account
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={signIn}
                                    className="w-full gap-2 bg-gradient-purple hover:opacity-90"
                                    size="lg"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Sign in with Google
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </Layout>
    );
}
