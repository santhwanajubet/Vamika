import { Link } from 'react-router-dom';

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have a question about your order, a product, or anything else? We&apos;re here to help.
      </p>

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="border rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Phone</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Customer Support</p>
              <a href="tel:+918075232878" className="font-medium hover:underline">+91 80752 32878</a>
            </div>
            <div>
              <p className="text-gray-500">Sales Enquiries</p>
              <a href="tel:+919847046280" className="font-medium hover:underline">+91 98470 46280</a>
            </div>
          </div>
        </div>

        <div className="border rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Hours</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Monday – Saturday</span>
              <span>10:00 AM – 7:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Sunday</span>
              <span>Closed</span>
            </div>
          </div>
        </div>

        <div className="border rounded p-6 sm:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Email</h2>
          <a href="mailto:support.vamika26@gmail.com" className="text-sm font-medium hover:underline">
            support.vamika26@gmail.com
          </a>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/" className="text-sm underline text-gray-500 hover:text-black">← Back to Home</Link>
      </div>
    </div>
  );
}
