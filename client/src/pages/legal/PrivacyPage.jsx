import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: July 11, 2026</p>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
          <p>
            When you create an account, we collect your name, email address, and phone number.
            When you place an order, we collect your shipping address and payment information.
            We also collect browsing data such as pages viewed, products searched, and items added to your cart.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfil your orders</li>
            <li>To send order confirmations, shipping updates, and delivery notifications</li>
            <li>To create and manage your account</li>
            <li>To personalise your shopping experience</li>
            <li>To improve our website, products, and services</li>
            <li>To send promotional emails (only if you opt in)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Information Sharing</h2>
          <p>
            We do not sell or rent your personal information to third parties.
            We share your information only with service providers necessary to operate our business,
            such as payment processors (Razorpay), shipping carriers, and cloud hosting providers.
            These providers are contractually obligated to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Cookies</h2>
          <p>
            We use cookies and similar technologies to maintain your session, remember your preferences,
            and analyse website traffic. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Data Security</h2>
          <p>
            We implement industry-standard security measures including SSL encryption, secure HTTP-only
            cookies for authentication tokens, and encrypted storage of sensitive data.
            However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed
            to provide you services. You may request deletion of your account and associated data
            at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this page
            with an updated effective date. Continued use of our website after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">9. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at{' '}
            <a href="/contact" className="underline">our contact page</a>.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <Link to="/" className="text-sm underline text-gray-500 hover:text-black">← Back to Home</Link>
      </div>
    </div>
  );
}
