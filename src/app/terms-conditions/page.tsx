import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | MerkadAgency',
    description: 'MerkadAgency terms and conditions for using our AI marketing services.',
};

export default function TermsConditionsPage() {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-content">
                    <h1>Terms & Conditions</h1>
                    <p className="legal-updated">Last updated: December 2025</p>

                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using MerkadAgency&apos;s website and services, you accept and agree to be bound
                            by the terms and provisions of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2>2. Services</h2>
                        <p>
                            MerkadAgency provides AI-powered marketing services including but not limited to:
                        </p>
                        <ul>
                            <li>AI Lead Capture & Qualification</li>
                            <li>Website Development with CRM Integration</li>
                            <li>CRM & Email/SMS Automation</li>
                            <li>AI SEO Automation</li>
                            <li>Content Systems & Social Media Management</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. User Responsibilities</h2>
                        <p>As a user of our services, you agree to:</p>
                        <ul>
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account</li>
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Not misuse or abuse our services</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Intellectual Property</h2>
                        <p>
                            All content, features, and functionality of our website and services are owned by
                            MerkadAgency and are protected by international copyright, trademark, and other
                            intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2>5. Limitation of Liability</h2>
                        <p>
                            MerkadAgency shall not be liable for any indirect, incidental, special, consequential,
                            or punitive damages resulting from your use of our services.
                        </p>
                    </section>

                    <section>
                        <h2>6. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will notify users of any
                            material changes by posting the new terms on this page.
                        </p>
                    </section>

                    <section>
                        <h2>7. Contact</h2>
                        <p>
                            For questions about these Terms & Conditions, contact us at{' '}
                            <a href="mailto:info@merkadagency.com">info@merkadagency.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
