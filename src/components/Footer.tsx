import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <img src="/logo.png" alt="Kindline Care Foundation" className="h-16 w-auto brightness-0 invert" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Restoring dignity and creating opportunity for orphans, vulnerable children, and widows.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-orange">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-brand-blue transition-colors">About Us</Link></li>
              <li><Link href="/programmes" className="hover:text-brand-blue transition-colors">Our Programmes</Link></li>
              <li><Link href="/impact" className="hover:text-brand-blue transition-colors">Impact & Stories</Link></li>
              <li><Link href="/get-involved" className="hover:text-brand-blue transition-colors">Donate</Link></li>
              <li><Link href="/volunteer" className="hover:text-brand-blue transition-colors">Partner with Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-orange">Contact Info</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><span className="text-gray-500">Email:</span> info@kindlinecare.org</li>
              <li><span className="text-gray-500">Phone:</span> +260 958 582 293</li>
              <li><span className="text-gray-500">Phone:</span> +260 762 595 634</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-orange">Support Our Cause</h4>
            <p className="text-sm text-gray-300 mb-6">Your support transforms lives and creates lasting impact in our communities.</p>
            <Link
              href="/get-involved"
              className="inline-block bg-brand-blue text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-brand-blue/90 transition-all shadow-lg"
            >
              Donate Now
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kindline Care Foundation. All rights reserved.</p>
          <p className="mt-2 font-medium text-gray-500">A Registered Non-Profit Organisation . <span className="text-brand-purple">My care.</span> <span className="text-brand-green">Your care.</span> <span className="text-brand-blue">Our care.</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
