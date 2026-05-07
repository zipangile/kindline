import Image from 'next/image';

const AboutSnapshot = ({ imageUrl }: { imageUrl?: string }) => {
  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8">What We Do</h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              We go beyond short-term support. We focus on building long-term resilience and independence.
            </p>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium mt-4">
              We do this through:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Education Support</h4>
              <p className="text-gray-600 leading-relaxed">
                Helping children stay in school and build a brighter future
              </p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Skills Development</h4>
              <p className="text-gray-600 leading-relaxed">
                Equipping widows with practical skills to earn and sustain livelihoods
              </p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Community Development</h4>
              <p className="text-gray-600 leading-relaxed">
                Partnering with communities to create sustainable, long-term solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="who-we-serve" className="py-24 bg-brand-blue text-white overflow-hidden relative scroll-mt-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-2xl text-white/80 font-bold uppercase tracking-widest mb-4">Who We Serve</h1>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
                Our work focuses on those who need it most.
              </h2>
              <ul className="space-y-6 mb-10">
                {[
                  "Orphans",
                  "Vulnerable children",
                  "Widows",
                  "Underserved communities"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-4 text-xl font-medium">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="p-8 bg-white/10 rounded-3xl border border-white/20">
                <p className="text-2xl font-bold italic">
                  &quot;Every person can thrive and unlock endless possibilities.&quot;
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[3rem] h-[500px] overflow-hidden shadow-2xl border-8 border-white/10">
                {imageUrl ? (
                  <Image src={imageUrl} alt="Who We Serve" fill className="object-cover" />
                ) : (
                  <div className="bg-white/5 h-full w-full flex items-center justify-center">
                    <p className="text-white/40 italic">Impact Image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSnapshot;
