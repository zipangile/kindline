const VisionMission = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-blue-50 p-10 rounded-3xl border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Vision
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed italic">
              A society where orphans, vulnerable children, and widows live with
              dignity, safety, and opportunity.
            </p>
          </div>
          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To improve the lives of orphans, vulnerable children, and widows
              by promoting education, skills development, healthcare, and
              psychosocial support, while empowering communities to break the
              cycle of poverty.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
