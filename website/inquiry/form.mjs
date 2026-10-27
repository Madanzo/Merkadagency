// Shared markup only; the simulation disclosure is added exclusively by the lab builder.
export const inquiryForm = `<section class="panel inquiry" aria-labelledby="inquiry-title"><h2 id="inquiry-title">Send a website inquiry</h2>
<p id="intake-availability" role="status">Checking inquiry availability…</p>
<div id="intake-content" hidden>
<p>Tell Camilo about a new website or a focused redesign. You do not need a finished brief. Scope, price, timing and responsibilities are agreed separately.</p>
<form id="website-inquiry" novalidate>
<p id="pending-note" hidden>Your pending inquiry is kept in this tab. Retry uses the same details and reference; it does not start a new inquiry. Browser session restoration may retain this copy.</p>
<p><label for="inquiry-name">Name</label><input id="inquiry-name" name="name" autocomplete="name" required maxlength="200"></p>
<p><label for="inquiry-email">Email</label><input id="inquiry-email" name="email" type="email" autocomplete="email" required maxlength="320"></p>
<p><label for="inquiry-url">Current website URL <span>(optional)</span></label><input id="inquiry-url" name="websiteUrl" type="url" maxlength="512" placeholder="https://example.com" aria-describedby="url-help"><small id="url-help">Use a full http or https address without login details, queries or fragments. Leave blank for a new website.</small></p>
<p><label for="inquiry-description">Project description</label><textarea id="inquiry-description" name="message" rows="6" required maxlength="4000" aria-describedby="description-help"></textarea><small id="description-help">What does your business do, and what should the website help visitors understand or do? Share open questions; do not include passwords, payment details or sensitive customer records.</small></p>
<div hidden aria-hidden="true"><label for="inquiry-trap">Leave this field empty</label><input id="inquiry-trap" name="website" tabindex="-1" autocomplete="off"></div>
<p class="small">When you send, this browser tab saves the attempted name, email, optional website, description, submission time and retry reference until confirmed receipt or discard. Verification tokens are not saved. This is an inquiry, not marketing or SMS consent. <a href="/legal/privacy">How we handle inquiry information</a>. </p>
<div id="verification"></div><p id="verification-status" role="status"></p>
<p><button id="inquiry-submit" class="cta" type="submit" disabled>Send website inquiry</button> <button id="inquiry-discard" type="button">Discard saved draft</button></p>
<div id="discard-confirm" hidden role="alertdialog" aria-label="Discard saved draft"><p>Discard the copy in this tab? This does not cancel an inquiry already received. Starting again after an uncertain response could create another inquiry.</p><button id="discard-yes" type="button">Discard saved draft</button> <button id="discard-no" type="button">Keep draft</button></div>
</form></div>
<p id="intake-feedback" tabindex="-1" role="status"></p>
<p>Email remains available: <a href="mailto:camiloreyna@merkadagency.com">camiloreyna@merkadagency.com</a>. If receipt is uncertain, mention the pending reference before starting a separate inquiry.</p></section>`;
export const inquiryStyles = `
.inquiry label{display:block;font-weight:650}.inquiry input,.inquiry textarea{display:block;width:100%;font:inherit;color:#f5f3f8;background:#0b0d10;border:1px solid #8e809e;border-radius:5px;padding:.65rem;margin-top:.4rem;scroll-margin-block:6rem}.inquiry small{display:block;color:#c6c0ce;line-height:1.6;margin-top:.4rem}.inquiry input:focus,.inquiry textarea:focus,.inquiry button:focus-visible{outline:3px solid #e3caff;outline-offset:4px}.inquiry button{font:inherit;line-height:1.5;cursor:pointer;white-space:normal}.inquiry button:not(.cta){background:#201b29;color:#fff;border:1px solid #9c87b5;padding:.5rem .7rem;border-radius:5px}.inquiry button:disabled{opacity:.65;cursor:not-allowed}.inquiry [readonly]{border-style:dashed}.inquiry [hidden]{display:none!important}#intake-feedback[role=alert]{color:#ffd4d4}#intake-feedback:focus{outline:3px solid #e3caff;outline-offset:4px;scroll-margin-block:6rem}.lab-note{border:1px solid #b08af3;padding:1rem;color:#f5f3f8}.inquiry .cta:after{display:none}
`;
