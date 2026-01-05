import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { isFirebaseInitialized } from '@/lib/firebase';
import { createLead, getLeads, Lead } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, LogIn, LogOut, Database, User } from 'lucide-react';

export default function FirebaseTest() {
    const { user, loading, isAllowed, signIn, signOut } = useAuth();
    const [firebaseStatus, setFirebaseStatus] = useState<boolean>(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [testMessage, setTestMessage] = useState<string>('');

    useEffect(() => {
        // Check if Firebase is initialized
        setFirebaseStatus(isFirebaseInitialized());
    }, []);

    const handleFetchLeads = async () => {
        setLoadingLeads(true);
        try {
            const fetchedLeads = await getLeads();
            setLeads(fetchedLeads);
            setTestMessage(`✓ Fetched ${fetchedLeads.length} leads`);
        } catch (error) {
            setTestMessage(`✗ Error fetching leads: ${error}`);
        } finally {
            setLoadingLeads(false);
        }
    };

    const handleCreateTestLead = async () => {
        try {
            const leadId = await createLead({
                name: 'Test Lead',
                email: 'test@example.com',
                phone: '555-0123',
                source: 'manual',
                status: 'new',
                notes: 'Created from Firebase test page',
            });
            setTestMessage(`✓ Created test lead with ID: ${leadId}`);
            // Refresh leads list
            await handleFetchLeads();
        } catch (error) {
            setTestMessage(`✗ Error creating lead: ${error}`);
        }
    };

    return (
        <Layout>
            <section className="pt-32 pb-20 lg:pt-40 lg:pb-24">
                <div className="container-custom max-w-4xl">
                    <h1 className="text-4xl font-display font-bold text-white mb-8">
                        Firebase Integration Test
                    </h1>

                    <div className="grid gap-6">
                        {/* Firebase Status */}
                        <Card className="bg-merkad-bg-secondary border-merkad-border">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Database className="w-5 h-5" />
                                    Firebase Status
                                </CardTitle>
                                <CardDescription>Check if Firebase is properly initialized</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    {firebaseStatus ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="text-green-500 font-mono">Connected</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5 text-red-500" />
                                            <span className="text-red-500 font-mono">Not Connected</span>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Auth Status */}
                        <Card className="bg-merkad-bg-secondary border-merkad-border">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Authentication
                                </CardTitle>
                                <CardDescription>Test Google sign-in and user status</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-merkad-purple" />
                                        <span className="text-merkad-text-muted">Loading auth state...</span>
                                    </div>
                                ) : user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {user.photoURL && (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName || 'User'}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            )}
                                            <div>
                                                <p className="text-white font-medium">{user.displayName}</p>
                                                <p className="text-merkad-text-muted text-sm">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-merkad-text-muted">Admin Access:</span>
                                            {isAllowed ? (
                                                <span className="text-green-500 font-mono">✓ Allowed</span>
                                            ) : (
                                                <span className="text-yellow-500 font-mono">⚠ Not Whitelisted</span>
                                            )}
                                        </div>
                                        <Button onClick={signOut} variant="outline" className="gap-2">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <Button onClick={signIn} className="gap-2 bg-gradient-purple">
                                        <LogIn className="w-4 h-4" />
                                        Sign in with Google
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Firestore Test */}
                        <Card className="bg-merkad-bg-secondary border-merkad-border">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Database className="w-5 h-5" />
                                    Firestore Test
                                </CardTitle>
                                <CardDescription>Test reading and writing to Firestore</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleFetchLeads}
                                        variant="outline"
                                        disabled={loadingLeads}
                                        className="gap-2"
                                    >
                                        {loadingLeads && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Fetch Leads
                                    </Button>
                                    <Button
                                        onClick={handleCreateTestLead}
                                        className="gap-2 bg-gradient-purple"
                                    >
                                        Create Test Lead
                                    </Button>
                                </div>

                                {testMessage && (
                                    <p className={`font-mono text-sm ${testMessage.startsWith('✓') ? 'text-green-500' : 'text-red-500'}`}>
                                        {testMessage}
                                    </p>
                                )}

                                {leads.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-white font-medium mb-2">Leads ({leads.length}):</h4>
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {leads.map((lead) => (
                                                <div
                                                    key={lead.id}
                                                    className="bg-merkad-bg-tertiary p-3 rounded-lg text-sm"
                                                >
                                                    <p className="text-white font-medium">{lead.name}</p>
                                                    <p className="text-merkad-text-muted">{lead.email}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-xs bg-merkad-purple/20 text-merkad-purple-light px-2 py-0.5 rounded">
                                                            {lead.status}
                                                        </span>
                                                        <span className="text-xs bg-merkad-bg-elevated text-merkad-text-muted px-2 py-0.5 rounded">
                                                            {lead.source}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
