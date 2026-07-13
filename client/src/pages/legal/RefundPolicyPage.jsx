import { Link } from 'react-router-dom';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Refund &amp; Cancellation Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: July 13, 2026</p>

      <div className="prose prose-sm text-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">1. Order Cancellation</h2>
          <p>
            You may cancel your order before it has been shipped. Once an order is cancelled,
            the full amount will be refunded to your original payment method within 5–10 business days.
            To cancel an order, please contact us with your order number.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Returns</h2>
          <p>
            We accept returns within 7 days of delivery, provided the product is in its original
            condition — unworn, unwashed, and with all tags intact. To initiate a return, contact us
            with your order number and reason for return.
          </p>
          <p className="mt-2">
            Items that are damaged, used, or without original tags are not eligible for return.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Refund Process</h2>
          <p>Once we receive and inspect the returned item:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A refund will be initiated within 2–3 business days</li>
            <li>The refund will be credited to your original payment method</li>
            <li>Refunds via UPI/cards typically reflect within 5–10 business days</li>
            <li>Shipping charges are non-refundable unless the return is due to our error</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Non-Refundable Items</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Products purchased during sale events (unless defective)</li>
            <li>Gift cards</li>
            <li>Items returned after the 7-day window</li>
            <li>Items that show signs of use or damage by the customer</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Damaged or Defective Products</h2>
          <p>
            If you receive a damaged or defective product, please contact us within 48 hours of
            delivery with photos of the damage. We will arrange a free return pickup and issue
            a full refund or replacement at no additional cost.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. Payment Failures</h2>
          <p>
            If your payment was deducted but the order was not confirmed, the amount will be
            automatically refunded within 5–10 business days. If you do not receive the refund
            within this period, please contact your bank or card issuer, and reach out to us
            with your payment transaction ID.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">7. Contact Us</h2>
          <p>
            For any refund or cancellation queries, please contact us at{' '}
            <a href="/contact" className="underline">our contact page</a>.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <Link to="/" className="text-sm underline text-gray-500 hover:text-black">&larr; Back to Home</Link>
      </div>
    </div>
  );
}
