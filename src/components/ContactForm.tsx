'use client';

import { useState, FormEvent } from 'react';

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'url' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
}

interface ContactFormProps {
    /** Form identifier for API routing */
    formType: 'contact' | 'newsletter' | 'booking' | 'audit';
    /** Form title */
    title?: string;
    /** Subtitle/description */
    subtitle?: string;
    /** Custom fields configuration */
    fields?: FormField[];
    /** Submit button text */
    submitText?: string;
    /** Success message */
    successMessage?: string;
    /** Custom class for styling */
    className?: string;
    /** Compact mode for newsletter forms */
    compact?: boolean;
}

const defaultFields: Record<string, FormField[]> = {
    contact: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
        { name: 'message', label: 'Message', type: 'textarea', placeholder: 'How can we help you?', required: true },
    ],
    newsletter: [
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email', required: true },
    ],
    booking: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000', required: true },
        { name: 'company', label: 'Company', type: 'text', placeholder: 'Your Company Name' },
        { name: 'website', label: 'Website', type: 'url', placeholder: 'https://yourwebsite.com' },
        {
            name: 'service', label: 'Service Interest', type: 'select', required: true, options: [
                { value: '', label: 'Select a service...' },
                { value: 'ai-lead-capture', label: 'AI Lead Capture' },
                { value: 'website-development', label: 'Website Development' },
                { value: 'crm-automation', label: 'CRM & Email/SMS' },
                { value: 'seo-automation', label: 'AI SEO Automation' },
                { value: 'content-systems', label: 'Content Systems' },
                { value: 'other', label: 'Other / Not Sure' },
            ]
        },
        {
            name: 'budget', label: 'Monthly Budget', type: 'select', options: [
                { value: '', label: 'Select budget range...' },
                { value: 'under-1k', label: 'Under $1,000/mo' },
                { value: '1k-3k', label: '$1,000 - $3,000/mo' },
                { value: '3k-5k', label: '$3,000 - $5,000/mo' },
                { value: '5k-10k', label: '$5,000 - $10,000/mo' },
                { value: 'over-10k', label: '$10,000+/mo' },
            ]
        },
        { name: 'message', label: 'Tell us about your project', type: 'textarea', placeholder: 'What are your goals? What challenges are you facing?' },
    ],
    audit: [
        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com', required: true },
        { name: 'website', label: 'Website URL', type: 'url', placeholder: 'https://yourwebsite.com', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
        { name: 'goals', label: 'What are your SEO goals?', type: 'textarea', placeholder: 'E.g., Increase organic traffic, rank for specific keywords, improve local SEO...' },
    ],
};

const defaultSuccessMessages: Record<string, string> = {
    contact: 'Thanks for reaching out! We\'ll get back to you within 24 hours.',
    newsletter: 'You\'re subscribed! Check your inbox for confirmation.',
    booking: 'Request received! We\'ll reach out within 24 hours to schedule your strategy call.',
    audit: 'Your audit request is submitted! Expect your comprehensive SEO report within 24 hours.',
};

export function ContactForm({
    formType,
    title,
    subtitle,
    fields,
    submitText = 'Submit',
    successMessage,
    className = '',
    compact = false,
}: ContactFormProps) {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const formFields = fields || defaultFields[formType] || defaultFields.contact;
    const successMsg = successMessage || defaultSuccessMessages[formType];

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch(`/api/${formType}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
                setErrorMessage(result.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
        }
    }

    if (status === 'success') {
        return (
            <div className={`form-success ${className}`}>
                <div className="success-icon">✓</div>
                <p>{successMsg}</p>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setStatus('idle')}
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`native-form ${compact ? 'compact' : ''} ${className}`}>
            {title && <h3 className="form-title">{title}</h3>}
            {subtitle && <p className="form-subtitle">{subtitle}</p>}

            <div className={`form-fields ${compact ? 'inline' : ''}`}>
                {formFields.map((field) => (
                    <div key={field.name} className="form-group">
                        {!compact && <label htmlFor={field.name}>{field.label}</label>}

                        {field.type === 'textarea' ? (
                            <textarea
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                required={field.required}
                                rows={4}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                id={field.name}
                                name={field.name}
                                required={field.required}
                            >
                                {field.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}
            </div>

            {status === 'error' && (
                <div className="form-error">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                className="btn-primary form-submit"
                disabled={status === 'loading'}
            >
                {status === 'loading' ? 'Sending...' : submitText}
                {status !== 'loading' && <span>→</span>}
            </button>
        </form>
    );
}

export default ContactForm;
