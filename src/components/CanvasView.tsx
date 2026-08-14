import React from 'react';
import { BMC_DATA } from '../data/singaporeData';
import { ShieldCheck, Download, Share2, Sparkles, Building2, Users, Layers, DollarSign, Wallet } from 'lucide-react';

interface CanvasViewProps {
  onExploreApp: () => void;
}

export const CanvasView: React.FC<CanvasViewProps> = ({ onExploreApp }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            RainRouter Business Canvas Reference
          </div>
          <h1 className="text-3xl font-extrabold text-[#003178] tracking-tight">
            RainRouter Business Model Canvas
          </h1>
          <p className="text-sm text-[#434652] mt-1">
            Strategic architecture translating Singapore civic datasets and sheltered walkway infrastructure into high-value commuter utility and B2B routing APIs.
          </p>
        </div>

        <button
          onClick={onExploreApp}
          className="bg-[#003178] hover:bg-[#002254] text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm shrink-0 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          Test Live Prototype
        </button>
      </div>

      {/* Main 9-Box Business Model Canvas Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c3c6d4]/40 shadow-sm space-y-6">
        {/* Top 5 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Box 1: Key Partners */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Key Partners</span>
              </div>
              <p className="text-[11px] text-blue-600/90 mb-3">What are your key partners to get competitive advantage?</p>
              <div className="bg-blue-200/50 p-3 rounded-xl border border-blue-300/60 shadow-xs space-y-2">
                {BMC_DATA.keyPartners.bulletPoints.map((point, idx) => (
                  <div key={idx} className="text-xs text-blue-950 font-medium flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Box 2: Key Activities & Key Resources (Stacked in 1 column) */}
          <div className="flex flex-col gap-4">
            {/* Key Activities */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex-1 flex flex-col">
              <div className="text-blue-900 font-bold text-sm mb-1">Key Activities</div>
              <p className="text-[11px] text-blue-600/90 mb-2">Key steps to move ahead:</p>
              <div className="bg-blue-200/50 p-3 rounded-xl border border-blue-300/60 shadow-xs space-y-1.5 flex-1">
                {BMC_DATA.keyActivities.bulletPoints.map((point, idx) => (
                  <div key={idx} className="text-xs text-blue-950 font-medium flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Resources */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex-1 flex flex-col">
              <div className="text-blue-900 font-bold text-sm mb-1">Key Resources</div>
              <p className="text-[11px] text-blue-600/90 mb-2">Resources to make idea work:</p>
              <div className="bg-blue-200/50 p-3 rounded-xl border border-blue-300/60 shadow-xs space-y-1.5 flex-1">
                {BMC_DATA.keyResources.bulletPoints.map((point, idx) => (
                  <div key={idx} className="text-xs text-blue-950 font-medium flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Box 3: Key Value Propositions (Center Yellow) */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col">
            <div className="text-amber-950 font-bold text-sm mb-1">Key Propositions</div>
            <p className="text-[11px] text-amber-700 mb-3">How will you make your customers' life happier?</p>
            <div className="bg-amber-200/70 p-3.5 rounded-xl border border-amber-300 shadow-xs space-y-2 flex-1">
              {BMC_DATA.keyPropositions.bulletPoints.map((point, idx) => (
                <div key={idx} className="text-xs text-amber-950 font-medium flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 4: Customer Relationships & Channels (Stacked Orange) */}
          <div className="flex flex-col gap-4">
            {/* Customer Relationships */}
            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/90 flex-1 flex flex-col">
              <div className="text-orange-950 font-bold text-sm mb-1">Customer Relationships</div>
              <p className="text-[11px] text-orange-700 mb-2">Interaction model:</p>
              <div className="bg-orange-200/70 p-3 rounded-xl border border-orange-300 shadow-xs space-y-1.5 flex-1">
                {BMC_DATA.customerRelationships.bulletPoints.map((point, idx) => (
                  <div key={idx} className="text-xs text-orange-950 font-medium flex items-start gap-1.5">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/90 flex-1 flex flex-col">
              <div className="text-orange-950 font-bold text-sm mb-1">Channels</div>
              <p className="text-[11px] text-orange-700 mb-2">How to reach customers:</p>
              <div className="bg-orange-200/70 p-3 rounded-xl border border-orange-300 shadow-xs space-y-1.5 flex-1">
                {BMC_DATA.channels.bulletPoints.map((point, idx) => (
                  <div key={idx} className="text-xs text-orange-950 font-medium flex items-start gap-1.5">
                    <span className="text-orange-600 font-bold">•</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Box 5: Customer Segments (Rose Pink) */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/90 flex flex-col">
            <div className="flex items-center gap-2 text-rose-950 font-bold text-sm mb-1">
              <Users className="w-4 h-4 text-rose-700" />
              <span>Customer Segments</span>
            </div>
            <p className="text-[11px] text-rose-700 mb-3">Who are your customers?</p>
            <div className="bg-rose-200/70 p-3.5 rounded-xl border border-rose-300 shadow-xs space-y-2 flex-1">
              {BMC_DATA.customerSegments.bulletPoints.map((point, idx) => (
                <div key={idx} className="text-xs text-rose-950 font-medium flex items-start gap-1.5">
                  <span className="text-rose-700 font-bold">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom 2 Columns: Cost Structure & Revenue Streams (Green/Emerald) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Cost Structure */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm mb-1">
              <Wallet className="w-4 h-4 text-emerald-700" />
              <span>Cost Structure</span>
            </div>
            <p className="text-[11px] text-emerald-700 mb-2">Planned development & infrastructure spend:</p>
            <div className="bg-emerald-200/70 p-3.5 rounded-xl border border-emerald-300 shadow-xs space-y-2">
              {BMC_DATA.costStructure.bulletPoints.map((point, idx) => (
                <div key={idx} className="text-xs text-emerald-950 font-medium flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Streams */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm mb-1">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>Revenue Streams</span>
            </div>
            <p className="text-[11px] text-emerald-700 mb-2">Monetization & B2B licensing opportunities:</p>
            <div className="bg-emerald-200/70 p-3.5 rounded-xl border border-emerald-300 shadow-xs space-y-2">
              {BMC_DATA.revenueStreams.bulletPoints.map((point, idx) => (
                <div key={idx} className="text-xs text-emerald-950 font-medium flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
