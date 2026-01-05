import { Layout } from '@/components/layout/Layout';

export function PrivacyPage() {
  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white">
              Privacy Policy
            </h1>
            <p className="text-merkad-text-muted mt-4">
              Last updated: January 1, 2025
            </p>

            <div className="mt-12 prose prose-invert max-w-none">
              <div className="space-y-8 text-merkad-text-secondary">
                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">1. Information We Collect</h2>
                  <p>
                    We collect information you provide directly to us, such as when you fill out a form, 
                    request a consultation, or communicate with us. This may include:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    <li>Name and contact information</li>
                    <li>Business name and website</li>
                    <li>Information about your business needs and challenges</li>
                    <li>Any other information you choose to provide</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">2. How We Use Your Information</h2>
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process and complete transactions</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Communicate with you about products, services, and events</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">3. Information Sharing</h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personally identifiable information 
                    to outside parties. This does not include trusted third parties who assist us in 
                    operating our website, conducting our business, or servicing you, so long as those 
                    parties agree to keep this information confidential.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">4. Data Security</h2>
                  <p>
                    We implement a variety of security measures to maintain the safety of your personal 
                    information. Your personal information is contained behind secured networks and is 
                    only accessible by a limited number of persons who have special access rights to 
                    such systems.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">5. Cookies</h2>
                  <p>
                    We use cookies to understand and save your preferences for future visits and compile 
                    aggregate data about site traffic and site interaction so that we can offer better 
                    site experiences and tools in the future.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">6. Third-Party Links</h2>
                  <p>
                    Occasionally, at our discretion, we may include or offer third-party products or 
                    services on our website. These third-party sites have separate and independent 
                    privacy policies. We therefore have no responsibility or liability for the content 
                    and activities of these linked sites.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">7. Your Rights</h2>
                  <p>
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    <li>Access the personal information we hold about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">8. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <p className="mt-3">
                    <strong className="text-white">Email:</strong> privacy@merkadagency.com
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
