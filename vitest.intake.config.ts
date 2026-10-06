import { defineConfig } from 'vitest/config';
import path from 'node:path';
if (!process.env.CRM_SOURCE_DIR || process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8685') {
  throw new Error('Canonical tests require CRM_SOURCE_DIR and local FIRESTORE_EMULATOR_HOST=127.0.0.1:8685. Never run against production.');
}
export default defineConfig({
  test: { environment: 'node', include: ['server/intake/canonical.integration.ts'], testTimeout: 30000, hookTimeout: 30000 },
  resolve: { alias: { '@': path.resolve(process.env.CRM_SOURCE_DIR) } },
});
