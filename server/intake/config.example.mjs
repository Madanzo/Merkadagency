// Documentation-only configuration. Not loaded by the website or Firebase.
export const config = {
  enabled: false,
  crmOrigin: '',       // Approved HTTPS CRM origin (no path/query/userinfo)
  tenantSlug: '',      // Confirm MerkadAgency tenant; never borrow Canvas/Phantom
  apiKey: '',          // Inject from server secret manager; never a VITE_* variable
  requestedService: '', // Approved service accepted by this tenant's intake mapper
  turnstileSiteKey: '', // Approved public widget key
  turnstileSecret: '', // Server secret binding only
  allowedOrigins: [], // Exact public website origins approved for this deployment
};
