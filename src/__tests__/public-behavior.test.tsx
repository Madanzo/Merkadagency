import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach } from 'vitest';
import { PublicDetail } from '@/pages/public/PublicPages';
import { BlogPage } from '@/pages/blog/BlogPage';
import { LeadMagnetTemplate } from '@/components/templates/LeadMagnetTemplate';
vi.mock('@/components/layout/Layout',()=>({Layout:({children}:{children:React.ReactNode})=><main>{children}</main>}));
afterEach(cleanup);
describe('public interactions',()=>{
 it('supports trailing slashes on existing service destinations',()=>{render(<MemoryRouter initialEntries={['/services/crm-automation/']}><PublicDetail/></MemoryRouter>);expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Keep the customer context together.');});
 it('filters blog topics without pretending unpublished articles are available',()=>{render(<MemoryRouter><BlogPage/></MemoryRouter>);fireEvent.click(screen.getByRole('button',{name:'Case Studies'}));expect(screen.getByRole('button',{name:'Case Studies'})).toHaveAttribute('aria-pressed','true');expect(screen.queryByRole('link',{name:/Kravings/i})).not.toBeInTheDocument();expect(screen.queryByText('Connecting inquiries to your CRM')).not.toBeInTheDocument();expect(screen.queryByText('Article awaiting publication review.')).not.toBeInTheDocument();expect(screen.queryByRole('textbox')).not.toBeInTheDocument();});
 it('opens a real resource without falsely collecting or sending an email',()=>{render(<MemoryRouter><LeadMagnetTemplate title="Planning guide" subtitle="Review your process" description="" benefits={['Identify inquiry ownership']} image="" industry="Business" seoTitle="" seoDescription="" resourceName="Planning guide" downloadUrl="/resources/contractor-lead-gen-guide.html"/></MemoryRouter>);expect(screen.getByRole('link',{name:/Open Planning guide/})).toHaveAttribute('href','/resources/contractor-lead-gen-guide.html');expect(screen.queryByRole('textbox')).not.toBeInTheDocument();expect(screen.queryByText('Resource sent!')).not.toBeInTheDocument();expect(screen.getByText(/does not send an email/)).toBeInTheDocument();});
});
