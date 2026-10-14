import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { isIndexableRoute, normalizePath, fragmentTarget } from '@/pages/public/routeMeta';
import { BlogPage } from '@/pages/blog/BlogPage';
vi.mock('@/components/layout/Layout', () => ({ Layout: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
afterEach(cleanup);
describe('launch indexing and navigation safety', () => {
  it('keeps unpublished proof and article routes out of generated sitemap while preserving services', () => {
    execFileSync(process.execPath, ['scripts/generate-sitemap.cjs']);
    const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
    for (const path of ['/portfolio', '/results', '/case-studies', '/case-studies/kravings', '/blog', '/blog/five-minute-rule', '/admin', '/sign/example', '/review/art-direction/a']) {
      expect(isIndexableRoute(path)).toBe(false);
      expect(sitemap).not.toContain(`<loc>https://merkadagency.com${path}</loc>`);
    }
    expect(isIndexableRoute('/services/website-development/')).toBe(true);
    expect(sitemap).toContain('<loc>https://merkadagency.com/services/website-development</loc>');
  });
  it('handles malformed encoded anchors without throwing and preserves valid anchors', () => {
    expect(fragmentTarget('#%E0%A4%A')).toBe('%E0%A4%A');
    expect(fragmentTarget('#main%2Dcontent')).toBe('main-content');
    expect(normalizePath('/contact/')).toBe('/contact');
  });
  it('does not describe an unknown article as a forthcoming publication', () => {
    render(<MemoryRouter initialEntries={['/blog/does-not-exist']}><Routes><Route path="/blog/:slug" element={<BlogPage/>}/></Routes></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Article not found.');
    expect(screen.queryByText('This article is not published yet.')).not.toBeInTheDocument();
  });
});
