import { Shield, Heart, Star, Users, HandHeart } from "lucide-react";

const CoreValues = () => {
  const values = [
    { name: "Integrity", description: "Upholding honesty, accountability, and transparency in all we do.", icon: <Shield className="h-6 w-6" /> },
    { name: "Compassion", description: "Serving others with empathy, love, and kindness.", icon: <Heart className="h-6 w-6" /> },
    { name: "Respect", description: "Preserving the dignity and rights of every individual.", icon: <Star className="h-6 w-6" /> },
    { name: "Community", description: "Promoting unity, collaboration, and shared responsibility.", icon: <Users className="h-6 w-6" /> },
    { name: "Service", description: "Transforming care into meaningful action that impacts lives.", icon: <HandHeart className="h-6 w-6" /> },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These principles guide every decision we make and every action we take.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {values.map((value, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 bg-blue-50 p-4 rounded-full text-blue-600 shadow-sm">
                {value.icon}
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">{value.name}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
