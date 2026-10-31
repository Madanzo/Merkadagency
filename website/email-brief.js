// Optional local clipboard controls. No inquiry is submitted or stored here.
const tools = document.querySelector('[data-email-tools]');
const actions = tools?.querySelector('[data-email-actions]');
const status = tools?.querySelector('[data-email-copy-status]');
const address = document.querySelector('[data-email-address]')?.textContent.trim();
const brief = tools?.querySelector('[data-email-brief]')?.textContent;
if (actions && status && address && brief && typeof navigator.clipboard?.writeText === 'function') {
  actions.hidden = false;
  const buttons = [...actions.querySelectorAll('button[data-copy-email]')];
  let copying = false;
  for (const button of buttons) {
    button.addEventListener('click', async () => {
      if (copying) return;
      const isAddress = button.dataset.copyEmail === 'address';
      copying = true;
      for (const control of buttons) control.setAttribute('aria-disabled', 'true');
      status.textContent = 'Copying…';
      try {
        await navigator.clipboard.writeText(isAddress ? address : brief);
        status.textContent = isAddress
          ? 'Email address copied. Paste it into your email service.'
          : 'Questions copied. Paste them into your email and add the details you know.';
      } catch {
        status.textContent = 'Copy did not work here. Select the address or questions above and copy them manually.';
      } finally {
        copying = false;
        for (const control of buttons) control.removeAttribute('aria-disabled');
      }
    });
  }
}
