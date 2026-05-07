'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

const Header = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Programmes', href: '/programmes' },
    { name: 'Impact', href: '/impact' },
    { name: 'Friends', href: '/get-involved' },
    { name: 'News', href: '/news' },
    { name: 'Volunteer', href: '/volunteer' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-3 lg:py-0">
      <nav className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between" aria-label="Global">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-none relative h-24 w-56" aria-label="Kindline Care">
            <Image src="/logo.png" alt="Kindline Care Foundation" fill className="object-contain" />
          </Link>
          <div className="lg:hidden">
            <button
              type="button"
              className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
              data-hs-collapse="#navbar-collapse-with-animation"
              aria-controls="navbar-collapse-with-animation"
              aria-label="Toggle navigation"
            >
              <svg className="hs-collapse-open:hidden w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
              </svg>
              <svg className="hs-collapse-open:block hidden w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>
        </div>
        <div id="navbar-collapse-with-animation" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block">
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 lg:flex-row lg:items-center lg:justify-end lg:gap-y-0 lg:gap-x-7 lg:mt-0 lg:ps-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-semibold ${
                  pathname === link.href ? 'text-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                } lg:py-6 transition-colors`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}

            {!user ? (
              <div className="flex flex-col lg:flex-row lg:items-center gap-y-4 lg:gap-y-0 lg:gap-x-3 mt-4 lg:mt-0">
                <Link href="/login" className="text-gray-700 hover:text-brand-blue font-semibold transition-colors">Log in</Link>
                <Link href="/signup" className="text-white bg-brand-blue hover:bg-blue-700 px-6 py-2 rounded-full font-bold transition-all text-center">Sign up</Link>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row lg:items-center gap-y-4 lg:gap-y-0 lg:gap-x-4 mt-4 lg:mt-0">
                <Link href="/dashboard" className="text-gray-700 hover:text-brand-blue font-semibold transition-colors">Dashboard</Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-brand-blue font-semibold transition-colors text-left"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
