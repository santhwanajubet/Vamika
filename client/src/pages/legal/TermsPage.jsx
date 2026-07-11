import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: July 11, 2026</p>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Vamika website and services, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Account Registration</h2>
          <p>
            You must be at least 18 years old to create an account. You are responsible for
            maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. You agree to provide accurate and complete information
            during registration.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Products and Pricing</h2>
          <p>
            All product descriptions, images, and specifications are as accurate as possible.
            However, colours may appear slightly different depending on your monitor settings.
            We reserve the right to modify prices without prior notice. All prices are in
            Indian Rupees (INR) and include applicable taxes unless stated otherwise.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Orders and Payment</h2>
          <p>
            Placing an order does not guarantee acceptance. We reserve the right to refuse or
            cancel any order for any reason, including product availability, errors in pricing,
            or suspected fraud. Payment is processed securely through Razorpay. We do not store
            your credit card or banking details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Shipping and Delivery</h2>
          <p>
            We aim to dispatch orders within 2-3 business days. Delivery times are estimates
            and may vary based on location and courier services. Free shipping is available on
            orders above ₹2,500. A flat shipping fee of ₹99 applies to orders below this amount.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. Returns and Refunds</h2>
          <p>
            We accept returns within 7 days of delivery for items that are unused, undamaged,
            and in their original packaging. To initiate a return, please contact our support team.
            Refunds will be processed to the original payment method within 5-7 business days
            after we receive and inspect the returned item.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">7. Order Cancellation</h2>
          <p>
            You may cancel your order while it is in the &quot;Confirmed&quot; or &quot;Processing&quot; stage.
            Once an order has been shipped, it cannot be cancelled. To cancel, visit your order
            details page or contact our support team.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">8. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, logos, graphics, and software,
            is the property of Vamika and is protected by copyright and trademark laws.
            You may not reproduce, distribute, or create derivative works without our written consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">9. Limitation of Liability</h2>
          <p>
            Vamika shall not be liable for any indirect, incidental, or consequential damages
            arising from the use of our website or products. Our total liability shall not exceed
            the amount paid for the product in question.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">10. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Changes will be effective
            immediately upon posting. Your continued use of the website constitutes acceptance
            of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">11. Contact Us</h2>
          <p>
            For any questions regarding these terms, please contact us at{' '}
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
