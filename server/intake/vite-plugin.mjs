import { createRuntime, nodeListener } from './runtime.mjs';
// Local preview always disables forwarding, independent of machine environment.
export function contactIntakePlugin() {
  const listener = nodeListener(createRuntime());
  const mount = server => { server.middlewares.use((req, res, next) => {
    if (req.url?.split('?')[0].startsWith('/api/contact-intake')) return listener(req, res);
    next();
  }); };
  return { name: 'contact-intake', configureServer: mount, configurePreviewServer: mount };
}
