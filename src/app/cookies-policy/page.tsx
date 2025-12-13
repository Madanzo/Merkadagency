import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookies Policy | MerkadAgency',
    description: 'MerkadAgency cookies policy - how we use cookies and similar technologies.',
};

export default function CookiesPolicyPage() {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-content">
                    <h1>Cookies Policy</h1>
                    <p className="legal-updated">Last updated: December 2025</p>

                    <section>
                        <h2>1. What Are Cookies</h2>
                        <p>
                            Cookies are small text files that are placed on your computer or mobile device when you
                            visit a website. They are widely used to make websites work more efficiently and provide
                            information to website owners.
                        </p>
                    </section>

                    <section>
                        <h2>2. How We Use Cookies</h2>
                        <p>We use cookies for the following purposes:</p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                            <li><strong>Marketing Cookies:</strong> Track your activity to deliver personalized content</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Third-Party Cookies</h2>
                        <p>
                            We may use third-party services that set their own cookies, including:
                        </p>
                        <ul>
                            <li>Google Analytics for website analytics</li>
                            <li>GoHighLevel for booking widgets and forms</li>
                            <li>Social media platforms for sharing functionality</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Managing Cookies</h2>
                        <p>
                            You can control and manage cookies through your browser settings. Please note that
                            removing or blocking cookies may impact your user experience and some features may
                            not function properly.
                        </p>
                    </section>

                    <section>
                        <h2>5. Cookie Preferences</h2>
                        <p>
                            Most web browsers allow you to:
                        </p>
                        <ul>
                            <li>See what cookies you have and delete them individually</li>
                            <li>Block third-party cookies</li>
                            <li>Block cookies from particular sites</li>
                            <li>Block all cookies</li>
                            <li>Delete all cookies when you close your browser</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Changes to This Policy</h2>
                        <p>
                            We may update this Cookies Policy from time to time. Any changes will be posted on
                            this page with an updated revision date.
                        </p>
                    </section>

                    <section>
                        <h2>7. Contact Us</h2>
                        <p>
                            If you have questions about our use of cookies, please contact us at{' '}
                            <a href="mailto:info@merkadagency.com">info@merkadagency.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
