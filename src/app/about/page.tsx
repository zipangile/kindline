import { Heart, Shield, Users, Star, HandHeart, ChevronDown } from "lucide-react";

export default function AboutPage() {
  const values = [
    { name: "Integrity", description: "Upholding honesty, accountability, and transparency in all we do.", icon: <Shield className="h-6 w-6" /> },
    { name: "Compassion", description: "Serving others with empathy, love, and kindness.", icon: <Heart className="h-6 w-6" /> },
    { name: "Respect", description: "Preserving the dignity and rights of every individual.", icon: <Star className="h-6 w-6" /> },
    { name: "Community", description: "Promoting unity, collaboration, and shared responsibility.", icon: <Users className="h-6 w-6" /> },
    { name: "Service", description: "Transforming care into meaningful action that impacts lives.", icon: <HandHeart className="h-6 w-6" /> },
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Kindline Care</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Dedicated to restoring dignity and creating opportunities for the most vulnerable in our society.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
              <p className="text-gray-400 italic">[Foundation Image: Team/Volunteers]</p>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Kindline Care Foundation is a non-profit organization established to work in the field of positive change in the lives of underprivileged persons, particularly orphans, vulnerable children, and widows.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                The foundation focuses on community-based interventions that restore dignity, create opportunity, and promote sustainable development. We believe in going beyond immediate relief to build long-term resilience and self-reliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values Accordion */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Foundation Principles</h2>

          <div className="hs-accordion-group">
            {/* Vision */}
            <div className="hs-accordion active bg-white border -mt-px first:rounded-t-lg last:rounded-b-lg border-gray-200" id="hs-basic-with-arrow-heading-one">
              <button className="hs-accordion-toggle hs-accordion-active:text-blue-800 py-3 px-5 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 rounded-t-lg disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-basic-with-arrow-collapse-one">
                <ChevronDown className="hs-accordion-active:rotate-180 w-4 h-4 transition-transform duration-300" />
                Our Vision
              </button>
              <div id="hs-basic-with-arrow-collapse-one" className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-with-arrow-heading-one">
                <div className="pb-4 px-5">
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    &quot;A society where orphans, vulnerable children, and widows live with dignity, safety, and opportunity.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="hs-accordion bg-white border -mt-px first:rounded-t-lg last:rounded-b-lg border-gray-200" id="hs-basic-with-arrow-heading-two">
              <button className="hs-accordion-toggle hs-accordion-active:text-blue-800 py-3 px-5 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-basic-with-arrow-collapse-two">
                <ChevronDown className="hs-accordion-active:rotate-180 w-4 h-4 transition-transform duration-300" />
                Our Mission
              </button>
              <div id="hs-basic-with-arrow-collapse-two" className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-with-arrow-heading-two">
                <div className="pb-4 px-5">
                  <p className="text-gray-700 leading-relaxed">
                    To improve the lives of orphans, vulnerable children, and widows by promoting education, skills development, healthcare, and psychosocial support, while empowering communities to break the cycle of poverty.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="hs-accordion bg-white border -mt-px first:rounded-t-lg last:rounded-b-lg border-gray-200" id="hs-basic-with-arrow-heading-three">
              <button className="hs-accordion-toggle hs-accordion-active:text-blue-800 py-3 px-5 inline-flex items-center gap-x-3 w-full font-semibold text-start text-gray-800 hover:text-gray-500 rounded-b-lg disabled:opacity-50 disabled:pointer-events-none" aria-controls="hs-basic-with-arrow-collapse-three">
                <ChevronDown className="hs-accordion-active:rotate-180 w-4 h-4 transition-transform duration-300" />
                Our Core Values
              </button>
              <div id="hs-basic-with-arrow-collapse-three" className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-with-arrow-heading-three">
                <div className="pb-4 px-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {values.map((value, index) => (
                      <div key={index} className="flex items-start gap-x-3">
                        <div className="mt-1 bg-blue-100 p-1.5 rounded-full text-blue-600">
                          {value.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{value.name}</h4>
                          <p className="text-sm text-gray-600">{value.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History / Background */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-900 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-blue-100">
                Kindline Care Foundation was born out of a deep concern for the increasing number of vulnerable individuals in our communities who lack basic support systems. We recognized that while charity provides immediate relief, true restoration comes from empowerment and sustainable community integration.
              </p>
              <p className="text-lg text-blue-100 mt-4">
                Since our inception, we have grown from a small group of concerned citizens to a registered NGO, impacting hundreds of lives through education, skills training, and community-led initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
