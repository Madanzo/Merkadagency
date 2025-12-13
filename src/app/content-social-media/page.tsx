'use client';

import { useState } from 'react';

export default function ContentPortfolioPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };

    const projects = [
        {
            title: "Cinematic Delivery Experience",
            client: "Kravings Cannabis",
            category: "commercial",
            src: "https://player.vimeo.com/video/1091713915?badge=0&autopause=0&player_id=0&app_id=58479&background=0&muted=1&loop=1&byline=0&title=0",
            metrics: [
                { value: "2.3M", label: "Views" },
                { value: "15%", label: "CTR" }
            ],
            desc: "High-impact commercial showcasing Kravings' premium cannabis delivery service. This cinematic piece increased brand awareness by 240%.",
            tags: ["Brand Awareness", "Cinematic", "Cannabis"],
            vertical: false
        },
        {
            title: "Product Showcase",
            client: "Kravings Cannabis",
            category: "product",
            src: "https://player.vimeo.com/video/1121989121?badge=0&autopause=0&player_id=0&app_id=58479&background=0&muted=1&loop=1&byline=0&title=0",
            metrics: [
                { value: "450K", label: "Views" },
                { value: "8.5%", label: "Conv." }
            ],
            desc: "Product-focused content highlighting premium cannabis offerings. Drove 35% increase in average order value.",
            tags: ["Product Video", "E-commerce"],
            vertical: false
        },
        {
            title: "Luxury Hotel Experience",
            client: "Hotel San Pancho",
            category: "hospitality social",
            src: "https://player.vimeo.com/video/1121988553?badge=0&autopause=0&player_id=0&app_id=58479&background=0&muted=1&loop=1&byline=0&title=0",
            metrics: [
                { value: "1.8M", label: "Reach" },
                { value: "22%", label: "Engage" }
            ],
            desc: "Vertical social media content for Instagram Reels and TikTok. Generated 65% increase in direct bookings.",
            tags: ["Social Media", "Reels", "Hospitality"],
            vertical: true
        },
        {
            title: "Cultural Heritage Tourism",
            client: "La Casa Macedonio",
            category: "hospitality commercial",
            src: "https://player.vimeo.com/video/1121988218?badge=0&autopause=0&player_id=0&app_id=58479&background=0&muted=1&loop=1&byline=0&title=0",
            metrics: [
                { value: "890K", label: "Views" },
                { value: "4.2x", label: "ROAS" }
            ],
            desc: "Cinematic destination video showcasing the cultural richness of Parras. Increased tourism bookings by 78%.",
            tags: ["Tourism", "Cultural", "Cinematic"],
            vertical: false
        },
        {
            title: "Luxury Property Showcase",
            client: "Eisenhower Rentals",
            category: "commercial",
            src: "https://player.vimeo.com/video/1121989533?badge=0&autopause=0&player_id=0&app_id=58479&background=0&muted=1&loop=1&byline=0&title=0",
            metrics: [
                { value: "320K", label: "Views" },
                { value: "45", label: "Leads" }
            ],
            desc: "High-end property tour video for luxury vacation rentals. Generated 45 qualified leads with high booking value.",
            tags: ["Real Estate", "Luxury", "Virtual Tour"],
            vertical: false
        },
        {
            title: "Viral Product Launch",
            client: "Orange Grasshopper",
            category: "social product",
            src: "https://player.vimeo.com/video/1121988431?badge=0&autopause=0&player_id=0&app_id=58479&background=0&muted=1&loop=1&byline=0&title=0",
            metrics: [
                { value: "5.2M", label: "Views" },
                { value: "28%", label: "Share" }
            ],
            desc: "Vertical content optimized for TikTok. Achieved viral status with 5.2M organic views and 28% share rate.",
            tags: ["Viral", "TikTok", "Product Launch"],
            vertical: true
        },
        {
            title: "Book Launch Campaign",
            client: "Teonanactl",
            category: "social product",
            src: "https://player.vimeo.com/video/1121988335?badge=0&autopause=0&player_id=0&app_id=58479&background=0&muted=1&loop=1&byline=0&title=0",
            metrics: [
                { value: "750K", label: "Reach" },
                { value: "2.8K", label: "Sales" }
            ],
            desc: "Educational content series for book launch. Resulted in 2,800 pre-orders and bestseller status.",
            tags: ["Publishing", "Educational", "Book Launch"],
            vertical: true
        }
    ];

    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(p => p.category.includes(activeFilter));

    return (
        <div className="content-wrapper">
            {/* Background Effects */}
            <div className="video-grid-bg"></div>

            {/* Hero Section */}
            <section className="hero-section text-center py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="inline-block px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold mb-6">
                        Content Portfolio
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        Content That Converts
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        From viral social campaigns to cinematic brand films, explore our portfolio of
                        high-converting video content that drives engagement and sales.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <div className="stat-item">
                            <div className="text-3xl font-bold text-white mb-2">500M+</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Total Views</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-3xl font-bold text-white mb-2">12.5%</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Avg. Engagement</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-3xl font-bold text-white mb-2">3.2x</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">ROAS Average</div>
                        </div>
                        <div className="stat-item">
                            <div className="text-3xl font-bold text-white mb-2">7</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Industries</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="border-y border-white/5 bg-black/20 backdrop-blur-sm sticky top-20 z-20">
                <div className="container mx-auto px-6 overflow-x-auto">
                    <div className="flex gap-8 min-w-max py-4 justify-center">
                        {['all', 'commercial', 'social', 'hospitality', 'product'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterClick(filter)}
                                className={`text-sm font-medium transition-colors duration-300 capitalize ${activeFilter === filter
                                        ? 'text-white border-b-2 border-purple-500 pb-1'
                                        : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {filter === 'all' ? 'All Projects' : filter + (filter === 'social' ? ' Media' : ' Videos')}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Portfolio */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredProjects.map((project, index) => (
                            <div key={index} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                                <div className={`video-player aspect-video bg-black relative ${project.vertical ? 'aspect-[9/16] md:aspect-video' : ''}`}>
                                    <iframe
                                        src={project.src}
                                        className="w-full h-full absolute top-0 left-0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                        title={project.title}
                                    />
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 block">{project.category}</span>
                                            <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                                            <p className="text-sm text-gray-400">{project.client}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            {project.metrics.map((metric, i) => (
                                                <div key={i} className="text-center">
                                                    <div className="text-lg font-bold text-white">{metric.value}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase">{metric.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        {project.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="cta-box rounded-3xl p-12 text-center relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-white/10">
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Create Content That Converts?</h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Let&apos;s build a content strategy that turns viewers into customers
                            </p>
                            <a href="/book" className="btn-cta bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors inline-block">
                                Start Your Content Journey →
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
