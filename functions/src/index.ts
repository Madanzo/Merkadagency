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
    startSubscriberSequence,
} from './email/triggers';

// Re-export drip sequence processor
export { processDripSequences } from './email/sequences';
