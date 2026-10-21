import React, { useState } from 'react';
import { Leaf, RefreshCcw, ShieldCheck, Box, Recycle, ArrowRight, Award, CheckCircle2, Calculator } from 'lucide-react';
import atelierInteriorImg from '../../assets/images/sustainability_atelier_interior_1792530468201.jpg';

interface SustainabilityPageProps {
  onNavigateToPage?: (pageId: 'about' | 'materials' | 'journal') => void;
}

export const SustainabilityPage: React.FC<SustainabilityPageProps> = ({ onNavigateToPage }) => {
  // Interactive Life Cycle & Carbon Calculator State
  const [garmentLifespanYears, setGarmentLifespanYears] = useState<number>(10);
  const [fastFashionCyclesPerYear, setFastFashionCyclesPerYear] = useState<number>(3);

  // Computed savings
  const disposableGarmentsAvoided = garmentLifespanYears * fastFashionCyclesPerYear;
  const carbonSavedKg = (disposableGarmentsAvoided * 8.5).toFixed(1);
  const waterSavedLiters = (disposableGarmentsAvoided * 2700).toLocaleString();
  const estimatedFinancialSavings = disposableGarmentsAvoided * 65 - 280;

  return (
    <div className="space-y-16">
      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 text-xs text-emerald-500 font-mono uppercase tracking-widest font-semibold">
            <span>Environmental Manifesto</span>
            <span aria-hidden="true">&bull;</span>
            <span>Net-Zero 2026</span>
            <span aria-hidden="true">&bull;</span>
            <span>Zero Landfill</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-[1.15] tracking-tight">
            The greenest object is the one you never replace.
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            Fast fashion produces 92 million tons of textile waste annually. At Shopaxe, we reject the logic of turnover. Our sustainability manifesto is simple: design objects with such structural integrity, material purity, and timeless proportion that they remain in your life for decades.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-emerald-500 tabular-nums">0%</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Virgin Synthetic Fibers</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-emerald-500 tabular-nums">100%</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Compostable Packaging</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-emerald-500 tabular-nums">Lifetime</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Free Atelier Repair</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-neutral-800 shadow-xl group bg-neutral-900">
            <img
              src={atelierInteriorImg}
              alt="Shopaxe Sustainable Design Atelier"
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                London Sustainable Lab
              </span>
              <p className="text-xs text-white/90 font-light mt-1">
                Zero-waste pattern nesting, solar-powered cutting tables, and natural dye archives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Closed-Loop Commitments */}
      <div className="space-y-8">
        <div className="border-b border-stone-200 dark:border-neutral-800 pb-4">
          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
            The Closed-Loop Circularity Protocol
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            How every garment, knife, bag, and hardware component journeys through our atelier life cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white">1. Biological &amp; Technical Extraction</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              We separate biological materials (organic cotton, vegetable-tanned leather, cashmere) from technical hardware (titanium, brass, Damascus steel) so every component can be disassembled and composted or remelted without cross-contamination.
            </p>
            <ul className="text-[11px] text-neutral-600 dark:text-neutral-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Zero petroleum-derived nylon or polyester</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Water-based, zero-heavy-metal tanning tannins</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white">2. Free Lifetime Care &amp; Resole</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              A tear or popped seam is not the end of a garment. Send any Shopaxe item back to our atelier at any time. Our guild artisans will restitch, patch with authentic selvedge offcuts, or re-edge leather free of charge for the life of the product.
            </p>
            <ul className="text-[11px] text-neutral-600 dark:text-neutral-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Complimentary stitch reinforcement &amp; blade resharpening</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Direct courier pickup arranged via support desk</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white">3. Buy-Back &amp; Archive Trade-In</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              Ready to part with a Shopaxe piece? We guarantee a 40% store-credit buyback for well-patinated archive pieces. Returned items are professionally sanitized, reconditioned, and re-offered through our Vintage Archive collection.
            </p>
            <ul className="text-[11px] text-neutral-600 dark:text-neutral-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Zero items ever discarded or incinerated</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Instant store credit issued upon workshop receipt</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Carbon & Impact Calculator */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-500 font-semibold mb-1">
            <Calculator className="w-4 h-4" />
            <span>Interactive Wardrobe Impact Simulator</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Calculate Your Decadal Resource Savings
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-light leading-relaxed">
            Compare the cumulative ecological footprint of owning one enduring Shopaxe piece versus standard commercial fast-fashion turnover over your chosen timeframe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6 p-6 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800">
            <div>
              <div className="flex justify-between text-xs font-bold text-neutral-900 dark:text-white mb-2">
                <span>Intended Lifespan of Considered Piece</span>
                <span className="font-mono text-emerald-500 tabular-nums">{garmentLifespanYears} Years</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                value={garmentLifespanYears}
                onChange={(e) => setGarmentLifespanYears(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                <span>3 Years</span>
                <span>10 Years</span>
                <span>25 Years</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-neutral-900 dark:text-white mb-2">
                <span>Equivalent Fast-Fashion Replacements Per Year</span>
                <span className="font-mono text-emerald-500 tabular-nums">{fastFashionCyclesPerYear} pieces / yr</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={fastFashionCyclesPerYear}
                onChange={(e) => setFastFashionCyclesPerYear(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                <span>1 piece</span>
                <span>3 pieces</span>
                <span>6 pieces</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
              Data grounded in the Ellen MacArthur Foundation Textile Circularity Benchmark and MIT Materials Life-Cycle Analysis (LCA).
            </p>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium uppercase font-mono">Carbon Emissions Prevented</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-700 dark:text-emerald-300 block tabular-nums">
                {carbonSavedKg} kg CO₂e
              </span>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Equal to driving 1,420 km in a gasoline passenger vehicle.</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium uppercase font-mono">Clean Water Conserved</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-blue-700 dark:text-blue-300 block tabular-nums">
                {waterSavedLiters} L
              </span>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Equal to ~180 standard household bath tubs of potable water.</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium uppercase font-mono">Landfill Units Diverted</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-700 dark:text-amber-300 block tabular-nums">
                {disposableGarmentsAvoided} Items
              </span>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Prevented from microplastic decomposition in global landfills.</p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium uppercase font-mono">Estimated Financial Savings</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-purple-700 dark:text-purple-300 block tabular-nums">
                ${estimatedFinancialSavings > 0 ? estimatedFinancialSavings.toLocaleString() : 0}
              </span>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Cost-per-wear amortization vs recurring cheap replacements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Packaging & Shipping */}
      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
              100% Plastic-Free Unboxing
            </span>
            <h3 className="font-serif text-2xl font-bold">Grown from Mycelium, Printed with Algae Ink</h3>
            <p className="text-xs text-neutral-400 font-light max-w-xl">
              Every parcel shipped from our Florence and London hubs is enclosed in agricultural mycelium composites and FSC certified unbleached kraft paper. Even our garment bags dissolve harmlessly in home compost within 45 days.
            </p>
          </div>

          {onNavigateToPage && (
            <button
              type="button"
              onClick={() => onNavigateToPage('materials')}
              className="px-6 py-3 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-200 transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Audit Raw Materials</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
