import { useState } from 'react';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

interface NewsletterSignupProps {
    variant?: 'inline' | 'card';
    className?: string;
}

export function NewsletterSignup({ variant = 'inline', className = '' }: NewsletterSignupProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            // Use email as document ID to prevent duplicates
            const subscriberRef = doc(db, 'subscribers', email);
            await setDoc(subscriberRef, {
                email,
                name: name || '',
                source: 'newsletter',
                tags: ['newsletter'],
                createdAt: Timestamp.now(),
                sequences: {},
            }, { merge: true });

            setStatus('success');
            setEmail('');
            setName('');

            // Reset after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error('Newsletter signup error:', error);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    if (variant === 'card') {
        return (
            <div className={`bg-gradient-to-br from-purple-900/50 to-violet-900/30 rounded-2xl p-8 border border-purple-500/20 ${className}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white">Get Growth Tips</h3>
                        <p className="text-sm text-merkad-text-muted">Weekly insights on AI automation</p>
                    </div>
                </div>

                {status === 'success' ? (
                    <div className="flex items-center gap-2 text-green-400 py-4">
                        <CheckCircle className="w-5 h-5" />
                        <span>You're in! Check your inbox.</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Subscribe'
                            )}
                        </Button>
                        {status === 'error' && (
                            <p className="text-red-400 text-sm">{errorMessage}</p>
                        )}
                    </form>
                )}
            </div>
        );
    }

    // Inline variant (default)
    return (
        <div className={`${className}`}>
            {status === 'success' ? (
                <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>You're subscribed! Check your inbox.</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-w-[200px]"
                        required
                    />
                    <Button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Mail className="w-4 h-4 mr-2" />
                                Subscribe
                            </>
                        )}
                    </Button>
                </form>
            )}
            {status === 'error' && (
                <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
            )}
        </div>
    );
}
