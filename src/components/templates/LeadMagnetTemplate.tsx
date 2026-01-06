import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/common/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Download, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createLead } from '@/lib/firestore';

interface LeadMagnetTemplateProps {
    title: string;
    subtitle: string;
    description: string;
    benefits: string[];
    image: string;
    industry: string;
    seoTitle: string;
    seoDescription: string;
    resourceName: string; // e.g. "MedSpa Automation Checklist"
}

export function LeadMagnetTemplate({
    title,
    subtitle,
    description,
    benefits,
    image,
    industry,
    seoTitle,
    seoDescription,
    resourceName
}: LeadMagnetTemplateProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        try {
            // Save lead to Firestore
            await createLead({
                name: `Lead Magnet: ${resourceName}`,
                email: email,
                source: 'form',
                status: 'new',
                notes: `Downloaded: ${resourceName} | Industry: ${industry}`
            });

            setSubmitted(true);
            toast.success("Resource sent!", {
                description: "Check your inbox for the download link."
            });
        } catch (error) {
            console.error('Error saving lead:', error);
            toast.error("Something went wrong", {
                description: "Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <SEO title={seoTitle} description={seoDescription} />

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left Column: Content */}
                        <div className="space-y-8">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-merkad-purple/10 border border-merkad-purple/20 text-merkad-purple-light text-xs font-semibold uppercase tracking-wider mb-4">
                                    Free Resource for {industry}
                                </span>
                                <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight mb-4">
                                    {title}
                                </h1>
                                <p className="text-xl text-merkad-text-secondary">
                                    {subtitle}
                                </p>
                            </div>

                            <div className="p-1 h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">What's Inside:</h3>
                                <ul className="space-y-3">
                                    {benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-merkad-green shrink-0 mt-0.5" />
                                            <span className="text-merkad-text-secondary">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Visual + Form */}
                        <div className="relative">
                            {/* Abstract Background Blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-merkad-purple/20 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative bg-merkad-bg-elevated border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                                {/* Preview Image */}
                                <div className="mb-8 rounded-xl overflow-hidden border border-white/5 shadow-inner bg-merkad-bg-tertiary">
                                    <img
                                        src={image}
                                        alt={resourceName}
                                        className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                                    />
                                </div>

                                {/* Form */}
                                {submitted ? (
                                    <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-merkad-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-merkad-green" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Check your inbox!</h3>
                                        <p className="text-merkad-text-secondary">
                                            We've sent the <strong>{resourceName}</strong> to {email}.
                                        </p>
                                        <Button
                                            variant="ghost"
                                            className="mt-6 text-merkad-purple-light hover:text-white"
                                            onClick={() => setSubmitted(false)}
                                        >
                                            Send to another email
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-white">
                                                Where should we send it?
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your work email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="bg-merkad-bg-primary border-white/10 focus:border-merkad-purple h-12"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 bg-gradient-purple text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Download Now <Download className="w-5 h-5 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-xs text-center text-merkad-text-muted">
                                            By downloading, you agree to receive updates. <br /> Unsubscribe at any time.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
