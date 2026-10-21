import React from 'react';
import { Compass, Feather, Award, Shield, Clock, MapPin, ArrowRight } from 'lucide-react';
import artisanWorkbenchImg from '../../assets/images/studio_artisan_workbench_1792530468729.jpg';

interface AboutPageProps {
  onNavigateToCategory?: (category: string) => void;
  onNavigateToPage?: (pageId: 'sustainability' | 'materials' | 'journal' | 'careers') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToCategory, onNavigateToPage }) => {
  return (
    <div className="space-y-16">
      {/* Editorial Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 text-xs text-amber-500 font-mono uppercase tracking-widest font-semibold">
            <span>Founded in 2021</span>
            <span aria-hidden="true">&bull;</span>
            <span>Florence</span>
            <span aria-hidden="true">&bull;</span>
            <span>London</span>
            <span aria-hidden="true">&bull;</span>
            <span>Tokyo</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-[1.15] tracking-tight">
            We build what transient fashion ignores: permanence.
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            Shopaxe was born out of fatigue with planned obsolescence and disposable luxury. We believe that true refinement exists in the absence of noise—in garments, objects, and acoustic instruments that grow more expressive the longer you live with them.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
            Every piece in our catalog is engineered like architectural hardware: drafted with rigorous geometric balance, cut from uncompromised organic textiles, and finished by master artisans who have spent decades perfecting their craft.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-neutral-800 shadow-xl group bg-neutral-900">
            <img
              src={artisanWorkbenchImg}
              alt="Shopaxe Master Artisan Workbench in Florence"
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Florence Atelier 01
              </span>
              <p className="text-xs text-white/90 font-light mt-1">
                Hand-burnishing and saddle-stitching Tuscan vegetable-tanned leather goods.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Architectural Pillars of Shopaxe */}
      <div className="space-y-8">
        <div className="border-b border-stone-200 dark:border-neutral-800 pb-4">
          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
            The Four Tenets of Considered Luxury
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            The core design rubric applied to every product before it enters our permanent catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white">Proportion &amp; Restraint</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              No superfluous logos or decorative seams. Every angle serves structural integrity, ergonomic balance, and visual calm.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Feather className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white">Tactile Honesty</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              Unadulterated raw materials: un-split Tuscan vegetable-tanned leather, Grade 5 aerospace titanium, and Mongolian cashmere.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white">Engineered Longevity</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              Double-needle topstitched seams, Goodyear-welted Vibram soles, and Japanese Damascus steel honed to hold an edge across decades.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white">Living Patina</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              We design for wear, not museum cases. Full-grain hides soften and darken, brushed titanium accumulates a tactile matte sheen, denim molds to your stride.
            </p>
          </div>
        </div>
      </div>

      {/* Global Atelier Hubs */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold block mb-1">
            Global Guild Network
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Where Craft Lives
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-light leading-relaxed">
            We partner exclusively with legacy workshops where mastery is handed down through generations, rejecting mega-factory mass production in favor of human hand-assembly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Florence, Italy</span>
            </div>
            <p className="text-xs text-amber-500/90 font-mono">Leather Goods &amp; Footwear Guild</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Centuries of vegetable-tanning wisdom in Santa Croce sull&apos;Arno, using chestnut and mimosa tannins for zero chemical effluent.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Seki &amp; Okayama, Japan</span>
            </div>
            <p className="text-xs text-amber-500/90 font-mono">Blade Metallurgy &amp; Selvedge Denim</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Forging 67-layer Damascus kitchen knives and shuttle-loomed 14oz rope-dyed indigo textiles on vintage Toyoda looms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>London, United Kingdom</span>
            </div>
            <p className="text-xs text-amber-500/90 font-mono">Acoustics &amp; Industrial Design</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Acoustic chamber tuning, aluminum milling tolerances, and user interface ergonomics engineered for everyday calm.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action & Exploration Links */}
      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold">Inspect Our Circularity &amp; Materials</h3>
          <p className="text-xs text-neutral-400 font-light max-w-lg">
            Explore our Net-Zero 2026 commitments, 100% traced raw materials register, or apply to join our global guild.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onNavigateToPage && (
            <>
              <button
                type="button"
                onClick={() => onNavigateToPage('sustainability')}
                className="px-5 py-2.5 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Sustainability Manifesto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateToPage('materials')}
                className="px-5 py-2.5 bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-700 transition-colors flex items-center gap-2 cursor-pointer border border-neutral-700"
              >
                <span>Material Transparency</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
