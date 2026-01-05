import { Layout } from '@/components/layout/Layout';

export function TermsPage() {
  return (
    <Layout>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white">
              Terms of Service
            </h1>
            <p className="text-merkad-text-muted mt-4">
              Last updated: January 1, 2025
            </p>

            <div className="mt-12 prose prose-invert max-w-none">
              <div className="space-y-8 text-merkad-text-secondary">
                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">1. Agreement to Terms</h2>
                  <p>
                    By accessing or using MerkadAgency's services, you agree to be bound by these Terms 
                    of Service. If you disagree with any part of the terms, you may not access the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">2. Services</h2>
                  <p>
                    MerkadAgency provides AI-powered marketing automation services, including but not 
                    limited to lead capture, CRM automation, SEO, content creation, and paid advertising 
                    management. The specific services provided will be outlined in your service agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">3. Client Responsibilities</h2>
                  <p>
                    As a client, you agree to:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Promptly notify us of any unauthorized access</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Pay for services as agreed in your service agreement</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">4. 90-Day Growth Guarantee</h2>
                  <p>
                    Our 90-Day Growth Guarantee is subject to the following conditions:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    <li>Client must implement recommended systems and strategies</li>
                    <li>Client must provide necessary access and resources</li>
                    <li>Guarantee applies to measurable improvements in lead response time and booking rates</li>
                    <li>Specific guarantee terms will be outlined in your service agreement</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">5. Intellectual Property</h2>
                  <p>
                    The MerkadFlow System™ and all related methodologies, processes, and materials are 
                    the intellectual property of MerkadAgency. Clients receive a license to use 
                    deliverables created specifically for their business but do not acquire ownership 
                    of our proprietary systems.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">6. Payment Terms</h2>
                  <p>
                    Payment terms, including amounts, schedules, and methods, will be specified in your 
                    service agreement. Late payments may result in service suspension or termination.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">7. Confidentiality</h2>
                  <p>
                    Both parties agree to maintain the confidentiality of proprietary information shared 
                    during the course of the engagement. This includes business strategies, customer data, 
                    and any other sensitive information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">8. Limitation of Liability</h2>
                  <p>
                    MerkadAgency shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages resulting from your use of our services. Our total liability 
                    shall not exceed the amount paid by you for services in the twelve months preceding 
                    the claim.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">9. Termination</h2>
                  <p>
                    Either party may terminate the service agreement with written notice as specified 
                    in the agreement. Upon termination, you will receive all deliverables completed 
                    up to the termination date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">10. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these terms at any time. We will notify existing 
                    clients of any material changes. Continued use of our services after changes 
                    constitutes acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">11. Contact</h2>
                  <p>
                    For questions about these Terms of Service, please contact us at:
                  </p>
                  <p className="mt-3">
                    <strong className="text-white">Email:</strong> legal@merkadagency.com
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
