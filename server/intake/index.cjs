const { onRequest } = require('firebase-functions/v2/https');
let handler;
exports.contactIntake = onRequest({
  region: 'us-central1', maxInstances: 1, concurrency: 8, timeoutSeconds: 30,
  memory: '256MiB', cors: false,
  secrets: ['CONTACT_CRM_API_KEY', 'CONTACT_TURNSTILE_SECRET'],
}, async (req, res) => {
  if (!handler) handler = import('./runtime.mjs').then(({createRuntime, runtimeConfig, nodeListener}) =>
    nodeListener(createRuntime({config: runtimeConfig(process.env)})));
  return (await handler)(req, res);
});
