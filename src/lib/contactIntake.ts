import type { InquiryAttribution } from './inquiryAttribution';
export type ContactQualification = Partial<Record<'companyName' | 'currentStack' | 'locale' | 'referralBrand' | 'desiredTimeline' | 'estimatedBudget', string>>;
export type ContactFields = { name: string; email: string; subject: string; message: string } & ContactQualification & { attribution?: InquiryAttribution };
export type ContactAttempt = { key: string; body: string };
export const CONTACT_ATTEMPT_KEY = 'merkadagency.contact.pending.v1';

export function prepareContactAttempt(fields: ContactFields): ContactAttempt {
  const limits = { name: 200, email: 320, subject: 200, message: 4500 };
  if (Object.entries(limits).some(([key, limit]) => {
    const value = fields[key as keyof typeof limits];
    return !value.trim() || value.length > limit;
  }) || /[\r\n]/.test(fields.subject) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    throw new Error('Please complete all fields with a valid email address.');
  }
  // Only fresh attempts select qualification values. Never enrich restored bodies.
  const qualification: ContactQualification = {};
  for (const [key, max] of Object.entries({ companyName: 200, currentStack: 600, locale: 20, referralBrand: 60, desiredTimeline: 120, estimatedBudget: 60 })) {
    const value = fields[key as keyof ContactQualification];
    if (value === undefined || value === '') continue;
    if (typeof value !== 'string' || value.length > max ||
        (key === 'locale' && value.trim() && !/^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(value.trim()))) {
      throw new Error('Please check the qualification details.');
    }
    if (value.trim()) qualification[key as keyof ContactQualification] = value;
  }
  const { name, email, subject, message } = fields;
  const body = JSON.stringify({ name, email, subject, message, ...qualification, ...(fields.attribution ? { attribution: fields.attribution } : {}), submittedAt: new Date().toISOString(), website: '' });
  if (new TextEncoder().encode(body).byteLength > 16_384) throw new Error('Please shorten your message.');
  return { key: crypto.randomUUID(), body };
}

export function restoreContactAttempt(): ContactAttempt | null {
  try {
    const stored = sessionStorage.getItem(CONTACT_ATTEMPT_KEY);
    if (!stored) return null;
    const value = JSON.parse(stored);
    const fields = JSON.parse(value.body);
    if (typeof value.key !== 'string' || !['name', 'email', 'subject', 'message'].every(k => typeof fields[k] === 'string')) return null;
    return value;
  } catch { return null; }
}

export async function submitContactAttempt(attempt: ContactAttempt, verificationToken: string): Promise<void> {
  const response = await fetch('/api/contact-intake', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.key, 'X-Turnstile-Token': verificationToken },
    body: attempt.body, signal: AbortSignal.timeout(15_000), redirect: 'error',
  });
  const result = await response.json();
  if (!response.ok || result.code !== 'persisted' || result.submissionId !== attempt.key) {
    throw new Error('Persistence was not confirmed');
  }
}
