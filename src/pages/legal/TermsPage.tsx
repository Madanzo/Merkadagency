import { Layout } from '@/components/layout/Layout';

/** Website scope only; does not replace or amend signed client agreements. */
export function TermsPage() {
  return <Layout><section className="public-editorial container-custom"><div className="max-w-3xl">
    <h1>Service information</h1>
    <p className="public-lead">Use this website to explore a possible project and start a conversation.</p>
    <div className="public-detail-sections">
      <section><h2>Inquiries and appointments</h2><p>A systems-review request is an inquiry about fit and scope. It is not a purchase, a confirmed appointment, or a promise of a free review, fixed price or delivery date. An external calendar confirms its own bookings.</p></section>
      <section><h2>Availability and scope</h2><p>Website development is our current offer. CRM integration and AI pilots are not offered as separate services. CRM activation remains unverified. Illustrative workflows do not establish deployed services or customer results. This website does not offer a payment checkout.</p></section>
      <section><h2>Project agreements</h2><p>Pricing, deliverables, ownership, support, cancellation and payment arrangements are specific to each project agreement. This website does not replace or amend an agreement you have signed.</p></section>
      <section><h2>Separate brands</h2><p>Canvas Advertising and Phantom Wraps &amp; Coatings handle their own inquiries and service scope. Following a referral link does not transfer your form details, place an order or create a shared booking.</p></section>
      <section><h2>Contact</h2><p>Discuss a project with us at <a className="underline" href="mailto:camiloreyna@merkadagency.com">camiloreyna@merkadagency.com</a>.</p></section>
    </div>
  </div></section></Layout>;
}
