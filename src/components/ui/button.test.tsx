import { render, screen } from '@testing-library/react';
import { Button } from './button';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('Button Component', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const user = userEvent.setup();
        await user.click(screen.getByRole('button', { name: /click me/i }));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
        render(<Button disabled>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
    });
});
