import Link from 'next/link';
import Image from 'next/image';
import { Music2 } from 'lucide-react';

interface FooterProps {
  logoUrl?: string;
}

const Footer = ({ logoUrl }: FooterProps) => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4 relative h-16">
              <Image src={logoUrl || "/logo.png"} alt="Kindline Care Foundation" fill className="object-contain brightness-0 invert" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Restoring dignity and creating opportunity for orphans, vulnerable children, and widows.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/YouthCareFoundation/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/kindline-care-foundation/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@kindlinecarefoundation?_r=1&_t=ZS-96IbFVOYkEe" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-blue transition-colors">
                <Music2 size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-blue">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-brand-blue transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-brand-blue transition-colors">About Us</Link></li>
              <li><Link href="/programmes" className="hover:text-brand-blue transition-colors">Programmes</Link></li>
              <li><Link href="/impact" className="hover:text-brand-blue transition-colors">Impact</Link></li>
              <li><Link href="/get-involved" className="hover:text-brand-blue transition-colors">Friends</Link></li>
              <li><Link href="/news" className="hover:text-brand-blue transition-colors">News</Link></li>
              <li><Link href="/volunteer" className="hover:text-brand-blue transition-colors">Volunteer</Link></li>
              <li><Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-blue">Contact Info</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><span className="text-gray-500">Email:</span> info@kindlinecare.org</li>
              <li><span className="text-gray-500">Phone:</span> +260 958 582 293</li>
              <li><span className="text-gray-500">Phone:</span> +260 762 595 634</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-brand-blue">Support Our Cause</h4>
            <p className="text-sm text-gray-300 mb-6">Your support transforms lives and creates lasting impact in our communities.</p>
            <Link
              href="/get-involved"
              className="inline-block bg-brand-blue text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-brand-blue/90 transition-all shadow-lg"
            >
              Become a Friend
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kindline Care Foundation. All rights reserved.</p>
          <p className="mt-2 font-medium text-gray-500">A Registered Non-Profit Organisation . <span className="text-brand-blue">My care. Your care. Our care.</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
