/**
 * Firebase Cloud Functions for MerkadAgency
 * Email Automation System
 */

// Re-export all email triggers
export {
    onContactFormSubmit,
    onSubscriberCreated,
    onLeadCreated,
    sendManualEmail,
} from './email/triggers';
