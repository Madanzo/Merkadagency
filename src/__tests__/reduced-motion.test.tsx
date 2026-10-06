import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ConceptualSystem } from '@/pages/concepts/ConceptualSystem';
import { AngularInquiry } from '@/pages/concepts/AngularInquiry';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('keeps both illustrations still while preserving keyboard-selectable explanations under reduced motion', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  const { container } = render(<><ConceptualSystem/><AngularInquiry/></>);
  expect(container.querySelector('.system-composition')).toHaveAttribute('data-reduced', 'true');
  expect(container.querySelector('.system-composition')).toHaveAttribute('data-playing', 'false');
  expect(container.querySelector('.connection-pulse')).toBeNull();
  expect(screen.queryByRole('button', { name: /Pause/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /^CRM$/ }));
  expect(screen.getByText('The inquiry stays connected to the customer record.')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('button', { name: /01Inquiry/ }), { key: 'ArrowRight' });
  expect(screen.getByRole('button', { name: /02Organize/ })).toHaveAttribute('aria-pressed', 'true');
});
