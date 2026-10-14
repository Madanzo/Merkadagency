import { Layout } from '@/components/layout/Layout';

/** Factual website notice. Contract, retention and jurisdiction decisions still require owner review. */
export function PrivacyPage() {
  return <Layout><section className="public-editorial container-custom"><div className="max-w-3xl">
    <h1>Website privacy</h1>
    <p className="public-lead">This notice describes the public website and its inquiry options.</p>
    <div className="public-detail-sections">
      <section><h2>Contacting us</h2><p>Online inquiry forms are currently disabled. The email link opens your email app; you choose whether to send a message. Email delivery and handling occur outside this website. Please do not send passwords, medical details or customer records in an initial inquiry.</p></section>
      <section><h2>Optional measurement</h2><p>This release does not activate Google Analytics, Firebase Analytics or Microsoft Clarity. Inquiry buttons and illustrative diagrams do not send analytics events to those providers.</p></section>
      <section><h2>Website delivery and links</h2><p>The website uses Google Firebase hosting and image delivery, and Google Fonts. Those providers receive requests needed to deliver their resources. Canvas Advertising and Phantom Wraps &amp; Coatings are separate destinations with their own handling of information. Selecting an email or external link does not submit an inquiry through this website.</p></section>
      <section><h2>Earlier pending inquiries</h2><p>If this browser tab has an earlier pending inquiry, its exact attempted details and retry reference may remain in session storage. Disabling intake does not cancel an inquiry already received. Browser session restoration can retain this data. Do not create a new inquiry to retry an uncertain result; contact us to check its status.</p></section>
      <section><h2>Questions</h2><p>Camilo Reyna handles privacy requests received at <a className="underline" href="mailto:camiloreyna@merkadagency.com">camiloreyna@merkadagency.com</a>. No fixed retention period or response deadline is represented by this notice.</p></section>
    </div>
  </div></section></Layout>;
}
