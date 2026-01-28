import { initializeApp } from 'firebase-admin/app';

initializeApp();

// Export Email Functions
export * from './email';

// Export Admin Functions
export * from './admin/backup';
