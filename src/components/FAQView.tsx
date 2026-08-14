import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Shield, Navigation, Umbrella } from 'lucide-react';

export const FAQView: React.FC<{ onPlanRoute: () => void }> = ({ onPlanRoute }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q: 'How does RainRouter calculate "sheltered percentages"?',
      a: 'RainRouter queries Singapore Land Transport Authority (LTA) covered walkway datasets, Urban Redevelopment Authority (URA) master plan underground connectors, and mall pedestrian pass-throughs. Each route polyline is segmented into covered links, air-conditioned MRT concourses, and open outdoor paths, providing an accurate shelter-to-distance ratio.'
    },
    {
      q: 'What happens when sudden rain starts while I am walking?',
      a: 'RainRouter connects to the National Environment Agency (NEA) live radar feed. When a rain cell moves towards your path, the app automatically triggers a Smart Rain Alert and calculates a revised route through the nearest sheltered linkway or MRT underpass within 10 minutes.'
    },
    {
      q: 'Does Sun Shade mode work differently from Rain mode?',
      a: 'Yes! Rain mode prioritizes 100% waterproof overhead canopies and underground passages. Sun Shade mode optimizes for natural canopy tree shading, building shadow projections (using solar azimuth and Singapore high-rise elevations), and air-conditioned shopping corridors to minimize UV and heat stroke risk.'
    },
    {
      q: 'Is OneMap API officially supported in Singapore?',
      a: 'Yes, OneMap is the authoritative Singapore geospatial map platform developed by the Singapore Land Authority (SLA). RainRouter utilizes OneMap tiles and Singapore routing protocols.'
    },
    {
      q: 'Can shopping malls and transport apps integrate RainRouter APIs?',
      a: 'Yes. As outlined in the RainRouter Business Model Canvas, we provide B2B routing SDKs and developer APIs for shopping mall navigators, food delivery couriers, and tourism applications seeking comfort-first pedestrian routing.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#003178]/10 text-[#003178] text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          Commuter Knowledge Base
        </div>
        <h1 className="text-3xl font-extrabold text-[#003178]">Frequently Asked Questions</h1>
        <p className="text-sm text-[#434652] max-w-xl mx-auto">
          Learn how RainRouter keeps Singapore pedestrians dry, shaded, and comfortable across all weather conditions.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#c3c6d4]/40 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-[#003178] hover:bg-[#faf8ff] cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-[#434652] leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#f3f3fb] rounded-2xl p-6 text-center space-y-3 border border-[#c3c6d4]/40">
        <h3 className="font-bold text-lg text-[#003178]">Have more questions or feedback?</h3>
        <p className="text-xs text-[#434652] max-w-md mx-auto">
          RainRouter is continuously expanding Singapore covered walkway mappings and real-time precipitation vectors.
        </p>
        <button
          onClick={onPlanRoute}
          className="bg-[#003178] hover:bg-[#002254] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          Start Planning Routes
        </button>
      </div>
    </div>
  );
};
