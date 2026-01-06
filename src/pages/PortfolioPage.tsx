import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/common/SEO';
import { Play, Video, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const videos = {
    ai: [
        {
            title: 'Pachis - Peach Flavor',
            client: 'Pachis Cannabis Store',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FPachis%20Peach%20Flavor%20.mp4?alt=media&token=ada85e84-66b1-4c3e-b1c9-10323f315d3a',
            type: 'Product Showcase'
        },
        {
            title: 'Pachis - Dabs',
            client: 'Pachis Cannabis Store',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FPachis%20Dabs.mp4?alt=media&token=9a7efb7f-0151-4241-93f2-47d93c9345c4',
            type: 'Product Showcase'
        },
        {
            title: 'Kravings - Flower Pack',
            client: 'Kravings Delivery Service',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FKravings%20Product.mp4?alt=media&token=4f605372-4d16-4d8b-ba8b-94f4b2d60891',
            type: 'Product Highlight'
        },
        {
            title: 'Cinematic Delivery Commercial',
            client: 'Kravings Delivery Service',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FCinematic%20Kravings%20Delivery.mp4?alt=media&token=94f23008-d4a7-4fe8-a07f-391f574379d8',
            type: 'Brand Commercial'
        },
        {
            title: 'Santa Family Toys',
            client: 'Season Snaps',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FLets_make_the_202512090243_0dm5e.mp4?alt=media&token=d84213e9-7b6e-4113-a112-6080b1bf49bc',
            type: 'Seasonal Campaign'
        },
        {
            title: 'Mexican Property Showcase',
            client: 'Real Estate',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FAmiga%20de%20Urencio%201.mp4?alt=media&token=ff7cc8e9-9423-4573-a749-6bf5c6fa423a',
            type: 'Property Tour'
        },
        {
            title: 'Texas Fourplex Showcase',
            client: 'Real Estate',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FEisenhower%20Video%201.mp4?alt=media&token=9fe0d89c-ca03-4c75-bb9a-d1090a53208f',
            type: 'Property Tour'
        }
    ],
    camera: [
        {
            title: 'Hotel San Pancho',
            client: 'Mexican Hotel Showcase',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FHotel%20San%20Pancho%203.mp4?alt=media&token=f5404cac-1f2e-4f2b-84c8-11e4eed1a9e7',
            type: 'Hospitality Tour'
        },
        {
            title: 'Orange Grasshopper',
            client: 'Yard Lawn Mowing Service',
            url: 'https://firebasestorage.googleapis.com/v0/b/merkadagency-dd2aa.firebasestorage.app/o/Video%20portfolio%2FOrange%20Grasshopper%201.mp4?alt=media&token=5004b83b-72b4-4ef3-ab7e-3c33896ba0b7',
            type: 'Service Highlight'
        }
    ]
};

export default function PortfolioPage() {
    const [activeTab, setActiveTab] = useState<'ai' | 'camera'>('ai');

    return (
        <Layout>
            <SEO
                title="Video Portfolio | MerkadAgency"
                description="Explore our high-converting video productions. AI-generated content for speed and scale, or cinematic live-action for premium brand storytelling."
            />

            {/* Hero */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-merkad-purple/10 border border-merkad-purple/20 text-merkad-purple-light text-xs font-semibold uppercase tracking-wider mb-6">
                            <Play className="w-3 h-3" /> Production Studio
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
                            Visual Stories that <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Stop the Scroll</span>
                        </h1>
                        <p className="text-merkad-text-secondary text-xl max-w-2xl mx-auto">
                            From AI-generated viral clips to cinematic commercial production. We create visual assets that capture attention and drive conversions.
                        </p>
                    </div>
                </div>
                {/* Background Ambience */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
            </section>

            {/* Gallery Section */}
            <section className="py-12 bg-merkad-bg-secondary/50 border-y border-white/5">
                <div className="container-custom">

                    {/* Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex items-center bg-merkad-bg-tertiary border border-white/5 rounded-full p-1.5 shadow-xl">
                            <button
                                onClick={() => setActiveTab('ai')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'ai'
                                    ? 'bg-merkad-purple text-white shadow-lg'
                                    : 'text-merkad-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Video className="w-4 h-4" />
                                AI Content
                            </button>
                            {/* Camera Tab hidden until video files are fixed in Firebase
                            <button
                                onClick={() => setActiveTab('camera')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'camera'
                                    ? 'bg-pink-500 text-white shadow-lg'
                                    : 'text-merkad-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Camera className="w-4 h-4" />
                                Camera Production
                            </button>
                            */}
                        </div>
                    </div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos[activeTab].map((video, index) => (
                            <div
                                key={index}
                                className="group relative bg-merkad-bg-tertiary rounded-2xl border border-white/5 overflow-hidden hover:border-merkad-purple/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Video Player Wrapper */}
                                <div className="aspect-[9/16] lg:aspect-video relative bg-black">
                                    <video
                                        controls
                                        className="w-full h-full object-contain"
                                        poster={activeTab === 'ai' ? undefined : undefined} // Could add posters if user provides images
                                        controlsList="nodownload"
                                    >
                                        <source src={video.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                {/* Video Info */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-merkad-purple-light">
                                            {video.type}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-merkad-purple-light transition-colors">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-merkad-text-secondary">
                                        {video.client}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {activeTab === 'ai' && (
                        <div className="mt-12 text-center">
                            <p className="text-merkad-text-secondary mb-4">
                                Our AI avatars and voiceovers reduce production costs by 80% while increasing engagement.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-merkad-purple/5" />
                <div className="container-custom relative text-center">
                    <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
                        Ready to go viral?
                    </h2>
                    <p className="text-merkad-text-secondary text-lg max-w-2xl mx-auto mb-10">
                        Whether you need scalable AI content or premium cinematic production, we have the tools to tell your story.
                    </p>
                    <Link
                        to="/book"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 btn-arrow"
                    >
                        Start Production
                        <Play className="w-5 h-5 fill-current" />
                    </Link>
                </div>
            </section>
        </Layout>
    );
}
