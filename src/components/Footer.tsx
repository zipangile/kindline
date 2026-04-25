import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Kindline Care</h3>
            <p className="text-gray-400 text-sm">
              Restoring dignity and creating opportunity for orphans, vulnerable children, and widows.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/programs" className="hover:text-white transition-colors">Our Programs</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">Impact & Stories</Link></li>
              <li><Link href="/get-involved" className="hover:text-white transition-colors">Get Involved</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@kindlinecare.org</li>
              <li>Phone: +260 958 582 293</li>
              <li>Phone: +260 762 595 634</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support Our Cause</h4>
            <p className="text-sm text-gray-400 mb-4">Your support transforms lives.</p>
            <Link
              href="/get-involved"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Donate Now
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kindline Care Foundation. All rights reserved.</p>
          <p className="mt-2">Registered NGO. My care. Your care. Our care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
