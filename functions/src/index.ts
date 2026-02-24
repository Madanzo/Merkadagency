import { initializeApp } from 'firebase-admin/app';

initializeApp();

// Export Email Functions
export * from './email';

// Export Admin Functions
export * from './admin/backup';

// Export AI Knowledge Functions
export * from './knowledge/processDocument';

// Export Inbound Webhooks
export * from './webhooks/inboundEmail';
export * from './webhooks/inboundSMS';

// ==========================================
// Phase 2: AI Agents
// ==========================================
export * from './agents/salesAgent';
export * from './agents/marketingAgent';
export * from './agents/aiSummary';

// ==========================================
// Phase 3: Delivery Engine (Email, SMS, PDF)
// ==========================================
export * from './delivery/sendSMS';
export * from './delivery/sendDeliveryEmail';
export * from './delivery/contractTriggers';
