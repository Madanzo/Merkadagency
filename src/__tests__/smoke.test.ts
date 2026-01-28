import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
    it('should pass basic math', () => {
        expect(1 + 1).toBe(2);
    });

    it('should have access to DOM', () => {
        const element = document.createElement('div');
        element.textContent = 'Hello';
        document.body.appendChild(element);
        expect(document.body).toHaveTextContent('Hello');
    });
});
