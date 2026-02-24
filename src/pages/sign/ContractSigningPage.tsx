import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { SignaturePad } from '@/components/sign/SignaturePad';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle,
    ScrollText,
    Loader2,
    Shield,
    FileText,
    AlertTriangle,
} from 'lucide-react';

// ============ TYPES ============

interface ContractData {
    contractNumber: string;
    clientId: string;
    services: Array<{ label: string; price: number; description?: string }>;
    monthlyServices: Array<{ label: string; price: number; description?: string }>;
    finalOneTimeTotal: number;
    finalMonthlyTotal: number;
    paymentTerms: string;
    projectInfo: { clientName: string; clientBusiness: string; startDate: string; duration: string; };
    status: string;
    publicToken: string;
    tokenExpiry: Timestamp;
    signedAt?: Timestamp;
    signatureData?: any;
}

const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

// ============ MAIN COMPONENT ============

export default function ContractSigningPage() {
    const { contractId } = useParams<{ contractId: string }>();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [contract, setContract] = useState<ContractData | null>(null);
    const [clientId, setClientId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [signing, setSigning] = useState(false);
    const [signed, setSigned] = useState(false);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const [signatureEmpty, setSignatureEmpty] = useState(true);

    const contractBodyRef = useRef<HTMLDivElement>(null);
    const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // Load contract
    useEffect(() => {
        async function loadContract() {
            if (!contractId || !token) {
                setError('Invalid contract link. Please check the URL.');
                setLoading(false);
                return;
            }

            try {
                // Decode token to get clientId  
                // Token format: base64(contractId:clientId:timestamp)
                const decoded = atob(token);
                const parts = decoded.split(':');
                if (parts.length < 2 || parts[0] !== contractId) {
                    setError('Invalid or expired link.');
                    setLoading(false);
                    return;
                }
                const cId = parts[1];
                setClientId(cId);

                const docRef = doc(db, `clients/${cId}/contracts`, contractId);
                const snap = await getDoc(docRef);

                if (!snap.exists()) {
                    setError('Contract not found.');
                    setLoading(false);
                    return;
                }

                const data = snap.data() as ContractData;

                // Verify token matches
                if (data.publicToken !== token) {
                    setError('Invalid access token.');
                    setLoading(false);
                    return;
                }

                // Check expiry
                if (data.tokenExpiry) {
                    const expiry = data.tokenExpiry.toDate ? data.tokenExpiry.toDate() : new Date(data.tokenExpiry as any);
                    if (new Date() > expiry) {
                        setError('This contract link has expired. Please contact MerkadAgency for a new link.');
                        setLoading(false);
                        return;
                    }
                }

                // Already signed?
                if (data.status === 'signed') {
                    setSigned(true);
                }

                setContract(data);
            } catch (err) {
                console.error('Error loading contract:', err);
                setError('Failed to load contract. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        loadContract();
    }, [contractId, token]);

    // Scroll detection
    const handleScroll = useCallback(() => {
        const el = contractBodyRef.current;
        if (!el) return;
        const threshold = 50;
        const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
        if (isAtBottom) setScrolledToBottom(true);
    }, []);

    // Sign contract
    const handleSign = async () => {
        if (!contractId || !clientId || !contract || signatureEmpty) return;

        // Get signature from canvas
        const canvas = document.querySelector('canvas');
        const pad = canvas ? (canvas as any).__signaturePad : null;
        if (!pad || pad.isEmpty()) {
            return;
        }

        setSigning(true);
        try {
            const signatureBase64 = pad.toBase64();

            // Get client IP (best effort)
            let ipAddress = 'unknown';
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipRes.json();
                ipAddress = ipData.ip;
            } catch { /* IP not critical */ }

            const docRef = doc(db, `clients/${clientId}/contracts`, contractId);
            await updateDoc(docRef, {
                status: 'signed',
                signedAt: Timestamp.now(),
                signatureData: {
                    clientSignature: signatureBase64,
                    ipAddress,
                    userAgent: navigator.userAgent,
                    signedAt: new Date().toISOString(),
                },
                updatedAt: Timestamp.now(),
            });

            setSigned(true);

            // Trigger backend processing (non-blocking)
            try {
                const functions = getFunctions();
                const onSigned = httpsCallable(functions, 'onContractSigned');
                await onSigned({ clientId, contractId });
            } catch (err) {
                console.warn('Backend trigger failed (non-critical):', err);
            }
        } catch (err) {
            console.error('Signing error:', err);
            setError('Failed to sign contract. Please try again.');
        } finally {
            setSigning(false);
        }
    };

    // ============ RENDER ============

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-8 text-center">
                        <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Contract</h2>
                        <p className="text-gray-600">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (signed) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contract Signed! 🎉</h2>
                        <p className="text-gray-600 mb-4">
                            Thank you for signing contract <strong>{contract?.contractNumber}</strong>.
                            A copy has been sent to your email.
                        </p>
                        <p className="text-sm text-gray-500">
                            The MerkadAgency team will be in touch shortly to kick off your project.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!contract) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ScrollText className="w-5 h-5 text-violet-600" />
                        <span className="font-semibold text-gray-900">MerkadAgency</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                        {contract.contractNumber}
                    </Badge>
                </div>
            </div>

            {/* Contract Body — scrollable */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div
                    ref={contractBodyRef}
                    onScroll={handleScroll}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto"
                    style={{ maxHeight: '60vh' }}
                >
                    <div className="p-8">
                        {/* Contract Header */}
                        <div className="text-center border-b border-gray-200 pb-6 mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Service Agreement</h1>
                            <p className="text-gray-500 mt-1">Contract {contract.contractNumber}</p>
                        </div>

                        {/* Parties */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Parties</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-700">Service Provider</p>
                                    <p className="text-gray-600">MerkadAgency LLC</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Client</p>
                                    <p className="text-gray-600">
                                        {contract.projectInfo?.clientName || 'Client'}
                                        {contract.projectInfo?.clientBusiness && `, ${contract.projectInfo.clientBusiness}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Services</h2>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 text-gray-700">Service</th>
                                        <th className="text-right py-2 text-gray-700">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contract.services?.map((s, i) => (
                                        <tr key={i} className="border-b border-gray-100">
                                            <td className="py-2 text-gray-600">{s.label}</td>
                                            <td className="py-2 text-right text-gray-900">{formatCurrency(s.price)}</td>
                                        </tr>
                                    ))}
                                    {contract.monthlyServices?.map((s, i) => (
                                        <tr key={`m-${i}`} className="border-b border-gray-100">
                                            <td className="py-2 text-gray-600">{s.label} <span className="text-xs text-gray-400">(monthly)</span></td>
                                            <td className="py-2 text-right text-gray-900">{formatCurrency(s.price)}/mo</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold">
                                        <td className="py-3 text-gray-900">One-Time Total</td>
                                        <td className="py-3 text-right text-gray-900">{formatCurrency(contract.finalOneTimeTotal)}</td>
                                    </tr>
                                    {contract.finalMonthlyTotal > 0 && (
                                        <tr className="font-semibold">
                                            <td className="py-2 text-gray-900">Monthly Total</td>
                                            <td className="py-2 text-right text-gray-900">{formatCurrency(contract.finalMonthlyTotal)}/mo</td>
                                        </tr>
                                    )}
                                </tfoot>
                            </table>
                        </div>

                        {/* Payment Terms */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Terms</h2>
                            <p className="text-sm text-gray-600">{contract.paymentTerms}</p>
                        </div>

                        {/* Timeline */}
                        {contract.projectInfo?.startDate && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Timeline</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-700">Start Date</p>
                                        <p className="text-gray-600">{contract.projectInfo.startDate}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Duration</p>
                                        <p className="text-gray-600">{contract.projectInfo.duration || 'As agreed'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Terms */}
                        <div className="mb-6 bg-gray-50 rounded-lg p-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Terms & Conditions</h2>
                            <div className="text-xs text-gray-500 space-y-2">
                                <p>1. <strong>Scope:</strong> Services are limited to those described above. Additional services require a separate agreement.</p>
                                <p>2. <strong>Payment:</strong> Invoices are due per the payment terms above. Late payments incur a 1.5% monthly fee.</p>
                                <p>3. <strong>Cancellation:</strong> Either party may cancel with 30 days written notice. Work completed prior to cancellation is billable.</p>
                                <p>4. <strong>Confidentiality:</strong> Both parties agree to keep all project details confidential.</p>
                                <p>5. <strong>Intellectual Property:</strong> Upon full payment, all deliverables become the client's property.</p>
                                <p>6. <strong>Liability:</strong> MerkadAgency's liability is limited to the total contract value.</p>
                            </div>
                        </div>

                        {/* Scroll indicator */}
                        {!scrolledToBottom && (
                            <div className="text-center py-4 text-sm text-violet-600 animate-bounce">
                                ↓ Scroll down to review all terms before signing
                            </div>
                        )}
                    </div>
                </div>

                {/* Signature Section */}
                <div className="mt-8">
                    <Card className={`border-2 ${scrolledToBottom ? 'border-violet-300 bg-white' : 'border-gray-200 bg-gray-100 opacity-75'}`}>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-violet-600" />
                                Digital Signature
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {scrolledToBottom
                                    ? 'Draw your signature below to sign this contract.'
                                    : 'Please scroll through and review the full contract before signing.'
                                }
                            </p>

                            {scrolledToBottom && (
                                <>
                                    <SignaturePad
                                        height={150}
                                        onSignatureChange={(isEmpty) => setSignatureEmpty(isEmpty)}
                                    />

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Shield className="w-3 h-3" />
                                            <span>Secured & legally binding</span>
                                        </div>
                                        <Button
                                            onClick={handleSign}
                                            disabled={signing || signatureEmpty}
                                            className="bg-violet-600 hover:bg-violet-700 text-white px-8"
                                        >
                                            {signing ? (
                                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing...</>
                                            ) : (
                                                'Sign Contract'
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="text-center py-8 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} MerkadAgency LLC · All rights reserved</p>
                </div>
            </div>
        </div>
    );
}
