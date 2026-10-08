import { Layout } from '@/components/layout/Layout';

/** Preserve old inbound links without presenting an unverified scheduler. */
export default function BookPage() {
  return <Layout><section className="public-editorial container-custom">
    <p className="public-caption">Website development</p>
    <h1>Discuss your website with Camilo.</h1>
    <p className="public-lead">Email Camilo Reyna about your website goals and project scope.</p>
    <a className="public-button" href="mailto:camiloreyna@merkadagency.com">Email Camilo Reyna</a>
    <p className="public-review-note">Your email app will open. You choose whether to send a message; this website does not send it for you.</p>
  </section></Layout>;
}
