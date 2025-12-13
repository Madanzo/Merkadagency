import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | MerkadAgency',
    description: 'MerkadAgency privacy policy - how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-content">
                    <h1>Privacy Policy</h1>
                    <p className="legal-updated">Last updated: December 2025</p>

                    <section>
                        <h2>1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you fill out a contact form,
                            subscribe to our newsletter, or book a strategy call.
                        </p>
                        <ul>
                            <li>Name and contact information</li>
                            <li>Business information</li>
                            <li>Communication preferences</li>
                            <li>Information about your marketing needs</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                            <li>Send marketing communications (with your consent)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Information Sharing</h2>
                        <p>
                            We do not sell, trade, or otherwise transfer your personal information to outside parties
                            except as described in this policy or with your consent.
                        </p>
                    </section>

                    <section>
                        <h2>4. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal
                            information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2>5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:info@merkadagency.com">info@merkadagency.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
