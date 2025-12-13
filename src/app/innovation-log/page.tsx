'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

// Types for WordPress Data
interface WPPost {
    id: number;
    date: string;
    link: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    content: { rendered: string };
    _embedded?: {
        'wp:featuredmedia'?: Array<{ source_url: string }>;
        'wp:term'?: Array<Array<{
            id: number;
            name: string;
            slug: string;
        }>>;
    };
}

interface WPCategory {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
}

// Internal API Proxies
const API_CATEGORIES = '/api/log-categories';
const API_POSTS = '/api/log-posts';
const POSTS_PER_PAGE = 9;

export default function InnovationLogPage() {
    // State
    const [posts, setPosts] = useState<WPPost[]>([]);
    const [featuredPost, setFeaturedPost] = useState<WPPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Record<string, number>>({});
    const [currentCategory, setCurrentCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Initial Load: Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(API_CATEGORIES);
                if (!response.ok) throw new Error('Failed to fetch categories');

                const data: WPCategory[] = await response.json();

                // Create slug to ID mapping
                const catMap: Record<string, number> = {};
                data.forEach(category => {
                    catMap[category.slug] = category.id;
                });
                setCategories(catMap);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Load Posts
    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                let apiUrl = `${API_POSTS}?per_page=${POSTS_PER_PAGE}&page=${currentPage}&_embed`;

                // Add category filter if we have the ID
                if (currentCategory !== 'all' && categories[currentCategory]) {
                    apiUrl += `&categories=${categories[currentCategory]}`;
                }

                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Failed to fetch posts');

                const data: WPPost[] = await response.json();
                const totalPagesHeader = response.headers.get('X-WP-TotalPages');
                setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);

                setPosts(data);

            } catch (error) {
                console.error('Error loading posts:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        if (currentCategory === 'all' || Object.keys(categories).length > 0) {
            loadPosts();
        }

    }, [currentPage, currentCategory, categories]);

    // Load Featured Post
    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const response = await fetch(`${API_POSTS}?per_page=1&sticky=true&_embed`);
                const data: WPPost[] = await response.json();
                if (data.length > 0) {
                    setFeaturedPost(data[0]);
                }
            } catch (error) {
                console.error('Error loading featured post:', error);
            }
        };
        loadFeatured();
    }, []);

    // Helpers
    const getFeaturedImage = (post: WPPost, size: 'large' | 'medium' = 'medium') => {
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
            return post._embedded['wp:featuredmedia'][0].source_url;
        }
        return `https://via.placeholder.com/${size === 'large' ? '800x500' : '400x240'}/5A27FF/FBCBD5?text=${encodeURIComponent(post.title.rendered)}`;
    };

    const getCategoryName = (post: WPPost) => {
        if (post._embedded && post._embedded['wp:term']) {
            const taxonomy = post._embedded['wp:term'][0];
            if (taxonomy && taxonomy.length > 0) {
                const valid = taxonomy.find(cat => cat.slug !== 'uncategorized');
                return valid ? valid.name : taxonomy[0].name;
            }
        }
        return 'General';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getExcerpt = (post: WPPost, limit = 150) => {
        const raw = post.excerpt.rendered || post.content.rendered || '';
        const stripped = raw.replace(/<[^>]*>/g, '');
        return stripped.substring(0, limit) + (stripped.length > limit ? '...' : '');
    };

    const handleCategoryClick = (catSlug: string) => {
        if (currentCategory !== catSlug) {
            setCurrentCategory(catSlug);
            setCurrentPage(1);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Style Helper
    const cx = (...classes: string[]) => classes.filter(Boolean).join(' ');

    return (
        <div className={styles.wrapper}>
            {/* Hero Section */}
            <section className={styles['blog-hero']}>
                <div className={styles.container}>
                    <div className={styles['hero-badge']}>Innovation Log</div>
                    <h1 className={styles['hero-title']}>Innovation Log</h1>
                    <p className={styles['hero-subtitle']}>
                        Latest trends, strategies, and case studies in AI-powered marketing and growth
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className={styles['filter-section']}>
                <div className={styles.container}>
                    <div className={styles['category-filters']}>
                        {['all', 'seo', 'ai-marketing', 'social-media', 'case-studies', 'tutorials'].map((cat) => (
                            <button
                                key={cat}
                                className={cx(styles['category-btn'], currentCategory === cat ? styles.active : '')}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                {cat === 'all' ? 'All Posts' : cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Content */}
            <section className={styles['blog-section']}>
                <div className={styles.container}>
                    {/* Featured Post */}
                    {currentCategory === 'all' && currentPage === 1 && featuredPost && (
                        <div className={styles['featured-post']}>
                            <div className={styles['featured-content']}>
                                <div className={styles['featured-info']}>
                                    <span className={styles['hero-badge']}>Featured</span>
                                    <h2 dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }}></h2>
                                    <p>{getExcerpt(featuredPost, 200)}</p>
                                    <a href={featuredPost.link} target="_blank" rel="noopener noreferrer" className={styles['featured-btn']}>
                                        Read More →
                                    </a>
                                </div>
                                <div className={styles['featured-image']}>
                                    <img src={getFeaturedImage(featuredPost, 'large')} alt={featuredPost.title.rendered} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Blog Grid */}
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading blog posts...</p>
                        </div>
                    ) : (
                        <>
                            {posts.length === 0 ? (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-gray)', padding: '60px' }}>
                                    <p style={{ fontSize: '18px', marginBottom: '8px' }}>No posts found in &quot;{currentCategory}&quot; category</p>
                                    <p style={{ fontSize: '14px', opacity: 0.7 }}>Try selecting a different category or check back later.</p>
                                    <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.5 }}>Source: MerkadAgency WP</p>
                                </div>
                            ) : (
                                <div className={styles['blog-grid']}>
                                    {posts.map(post => (
                                        <article key={post.id} className={styles['blog-card']} onClick={() => window.open(post.link, '_blank')}>
                                            <div className={styles['blog-image']}>
                                                <img src={getFeaturedImage(post)} alt={post.title.rendered} loading="lazy" />
                                            </div>
                                            <div className={styles['blog-content']}>
                                                <div className={styles['blog-meta']}>
                                                    <span className={styles['blog-category']}>{getCategoryName(post)}</span>
                                                    <span className={styles['blog-date']}>{formatDate(post.date)}</span>
                                                </div>
                                                <h3 className={styles['blog-title']} dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h3>
                                                <p className={styles['blog-excerpt']}>{getExcerpt(post)}</p>
                                                <a href={post.link} className={styles['read-more']} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                    Read More <span>→</span>
                                                </a>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    {currentPage > 1 && (
                                        <button className={styles['page-btn']} onClick={() => handlePageChange(currentPage - 1)}>
                                            ←
                                        </button>
                                    )}

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    className={cx(styles['page-btn'], currentPage === page ? styles.active : '')}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <span key={page} style={{ color: 'var(--text-gray)' }}>...</span>;
                                        }
                                        return null;
                                    })}

                                    {currentPage < totalPages && (
                                        <button className={styles['page-btn']} onClick={() => handlePageChange(currentPage + 1)}>
                                            →
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
