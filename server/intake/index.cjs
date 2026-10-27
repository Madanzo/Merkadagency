const { onRequest } = require('firebase-functions/v2/https');
let handler;
exports.contactIntake = onRequest({
  region: 'us-central1', maxInstances: 1, concurrency: 8, timeoutSeconds: 30,
  memory: '256MiB', cors: false,
  secrets: ['CONTACT_CRM_API_KEY', 'CONTACT_TURNSTILE_SECRET'],
}, async (req, res) => {
  if (!handler) handler = import('./runtime.mjs').then(async ({createRuntime, runtimeConfig, nodeListener}) => {
    const config=runtimeConfig(process.env); let distributedLimiter;
    if(config.enabled && typeof config.abuseDatabaseId==='string' && /^(?:\(default\)|[a-z][a-z0-9-]{3,62})$/.test(config.abuseDatabaseId) && Number.isInteger(config.abuseLimit) && config.abuseLimit>=1 && config.abuseLimit<=1000 && !process.env.FIRESTORE_EMULATOR_HOST && process.env.GCLOUD_PROJECT==='merkadagency-dd2aa') {
      const {getApps,initializeApp}=require('firebase-admin/app');
      const {getFirestore}=require('firebase-admin/firestore');
      const {createDistributedLimiter}=await import('./distributed-abuse.mjs');
      const app=getApps()[0] || initializeApp();
      distributedLimiter=createDistributedLimiter({db:getFirestore(app,config.abuseDatabaseId),limit:config.abuseLimit});
    }
    return nodeListener(createRuntime({config,distributedLimiter}));
  });
  return (await handler)(req, res);
});
