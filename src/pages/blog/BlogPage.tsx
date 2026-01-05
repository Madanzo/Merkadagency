import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

const featuredPost = {
  title: 'How AI is Revolutionizing Lead Response for Service Businesses',
  excerpt: 'Discover how automated lead response can increase your conversion rates by up to 391% and why response time is the single most important factor in closing deals.',
  category: 'AI & Automation',
  readTime: '8 min read',
  date: 'Jan 3, 2025',
  slug: 'ai-lead-response-revolution',
};

const posts = [
  {
    title: 'The 5-Minute Rule: Why Speed-to-Lead Matters More Than Ever',
    excerpt: 'Research shows that responding to leads within 5 minutes makes you 21x more likely to qualify them. Here\'s how to make it happen.',
    category: 'Lead Generation',
    readTime: '5 min read',
    date: 'Dec 28, 2024',
    slug: 'five-minute-rule',
  },
  {
    title: 'Case Study: How Kravings Club Achieved 196% Revenue Growth',
    excerpt: 'A deep dive into the systems, strategies, and automation that transformed a cannabis delivery business.',
    category: 'Case Studies',
    readTime: '10 min read',
    date: 'Dec 20, 2024',
    slug: 'kravings-case-study',
  },
  {
    title: 'CRM Automation 101: Stop Babysitting Your Pipeline',
    excerpt: 'Your CRM should work for you, not the other way around. Learn how to set up automations that close deals on autopilot.',
    category: 'AI & Automation',
    readTime: '7 min read',
    date: 'Dec 15, 2024',
    slug: 'crm-automation-101',
  },
  {
    title: 'SEO for Medspas: Ranking in Your Local Market',
    excerpt: 'A complete guide to dominating local search results and attracting clients who are ready to book.',
    category: 'Lead Generation',
    readTime: '12 min read',
    date: 'Dec 10, 2024',
    slug: 'medspa-seo-guide',
  },
  {
    title: 'The MerkadFlow System™: Our 4-Phase Growth Framework',
    excerpt: 'An inside look at the proprietary system we use to help service businesses scale without adding headcount.',
    category: 'AI & Automation',
    readTime: '6 min read',
    date: 'Dec 5, 2024',
    slug: 'merkadflow-system-explained',
  },
];

const categories = ['All', 'AI & Automation', 'Lead Generation', 'Case Studies'];

export function BlogPage() {
  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-mono text-merkad-purple-light uppercase tracking-wider">
              Innovation Log
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mt-4">
              Insights & Strategies
            </h1>
            <p className="text-merkad-text-secondary mt-6 text-lg max-w-2xl mx-auto">
              Actionable insights on AI automation, lead generation, and scaling service businesses.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, i) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  i === 0
                    ? 'bg-merkad-purple text-white'
                    : 'bg-merkad-bg-tertiary text-merkad-text-secondary hover:text-white hover:bg-merkad-bg-elevated'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <div className="card-gradient-border">
              <div className="card-gradient-border-inner">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block px-3 py-1 bg-merkad-purple/20 text-merkad-purple-light text-xs font-mono rounded-full mb-4">
                      {featuredPost.category}
                    </span>
                    <h2 className="text-2xl lg:text-3xl font-display font-bold text-white">
                      {featuredPost.title}
                    </h2>
                    <p className="text-merkad-text-secondary mt-4">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-6 text-sm text-merkad-text-muted">
                      <span>{featuredPost.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-merkad-purple-light hover:text-white transition-colors font-medium btn-arrow"
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="bg-merkad-bg-elevated rounded-xl aspect-video flex items-center justify-center">
                    <span className="text-merkad-text-muted">[Featured Image]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="service-card flex flex-col h-full">
                <div className="bg-merkad-bg-elevated rounded-lg aspect-video flex items-center justify-center mb-4">
                  <span className="text-merkad-text-muted text-sm">[Image]</span>
                </div>
                <span className="inline-block px-3 py-1 bg-merkad-purple/20 text-merkad-purple-light text-xs font-mono rounded-full w-fit mb-3">
                  {post.category}
                </span>
                <h3 className="text-lg font-display font-bold text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-merkad-text-secondary text-sm flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-merkad-text-muted">{post.date}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-merkad-purple-light hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    Read
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-20 text-center">
            <div className="max-w-xl mx-auto">
              <h3 className="text-2xl font-display font-bold text-white">
                Get Weekly Growth Insights
              </h3>
              <p className="text-merkad-text-secondary mt-3">
                Join 500+ business owners getting actionable tips on automation and lead generation.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="px-4 py-3 bg-merkad-bg-tertiary border border-white/10 rounded-lg text-white placeholder-merkad-text-muted focus:border-merkad-purple focus:outline-none focus:ring-1 focus:ring-merkad-purple flex-grow max-w-xs"
                />
                <button className="px-6 py-3 bg-gradient-purple text-white font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
