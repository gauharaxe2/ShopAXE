import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, MapPin, Award, CheckCircle2, ChevronRight, FileText, ArrowRight, Sparkles } from 'lucide-react';
import selvedgeTitaniumImg from '../../assets/images/materials_selvedge_titanium_1792530467913.jpg';

interface MaterialItem {
  id: string;
  name: string;
  category: 'Leather' | 'Denim & Textiles' | 'Metals & Alloys' | 'Wool & Cashmere';
  origin: string;
  certification: string;
  certificationId: string;
  specifications: string;
  description: string;
  durabilityRating: string;
  careProtocol: string;
}

const RAW_MATERIALS: MaterialItem[] = [
  {
    id: 'tuscan-leather',
    name: 'Tuscan Full-Grain Vegetable-Tanned Cowhide',
    category: 'Leather',
    origin: 'Santa Croce sull’Arno, Tuscany, Italy',
    certification: 'Consorzio Vera Pelle Italiana Conciata al Vegetale',
    certificationId: 'IT-TUSC-PELLE-4882',
    specifications: '3.2mm un-split saddle temper, steeped in natural chestnut and mimosa bark tannins for 40 days.',
    description: 'Zero chromium salts, zero petroleum plastic coatings. Retains natural cowhide grain, fat wrinkles, and pore structure that deepens to an amber caramel patina with sunlight and skin contact.',
    durabilityRating: '50+ Years (Guaranteed tear-resistant to 420 N/mm²)',
    careProtocol: 'Condition annually with pure organic beeswax balm. Avoid prolonged water submersion.',
  },
  {
    id: 'okayama-selvedge',
    name: '14oz Japanese Shuttle-Loomed Selvedge Denim',
    category: 'Denim & Textiles',
    origin: 'Kojima, Okayama Prefecture, Japan',
    certification: 'GOTS Organic Certified Cotton (License #OK-DENIM-91)',
    certificationId: 'JP-OKY-SELVEDGE-770',
    specifications: '14.2oz per sq. yard, woven on vintage 1960s Toyoda automatic shuttle looms with pink ID ticker selvedge edge.',
    description: 'Rope-dyed 12 times in pure indigo vats. Slubby, tactile texture that forms distinctive whiskering, honeycombs, and individualized fades according to your posture.',
    durabilityRating: '20+ Years of daily wear (Double-needle felled construction)',
    careProtocol: 'Wash cold inside-out every 6 months of wear; air dry flat in shade.',
  },
  {
    id: 'aerospace-titanium',
    name: 'Grade 5 Titanium Alloy (Ti-6Al-4V)',
    category: 'Metals & Alloys',
    origin: 'Sheffield & Osaka Precision Smelters',
    certification: 'ASTM B348 Aerospace & Biocompatibility Certified',
    certificationId: 'AERO-TI-GR5-0924',
    specifications: 'Tensile strength 895 MPa, density 4.43 g/cm³, 100% hypoallergenic, precision CNC milled within 0.02mm tolerance.',
    description: 'Twice the strength of marine-grade stainless steel at roughly half the weight. Naturally builds a self-healing titanium dioxide passivating film that resists ocean saltwater and sweat corrosion indefinitely.',
    durabilityRating: 'Centuries (Immune to oxidation & rust)',
    careProtocol: 'Wipe with microfiber cloth. Mild soapy water if needed.',
  },
  {
    id: 'mongolian-cashmere',
    name: 'Grade A De-Haired Mongolian Cashmere',
    category: 'Wool & Cashmere',
    origin: 'Alashan Steppes, Inner Mongolia',
    certification: 'OEKO-TEX Standard 100 & Sustainable Cashmere Alliance',
    certificationId: 'OEKO-TEX-CASH-4091',
    specifications: 'Fiber fineness 14.8 microns, staple length 38mm, 2-ply twisted combed yarn.',
    description: 'Hand-combed from free-roaming mountain goats during spring shedding without shearing trauma. Zero chemical silicone softeners—its cloud-soft loft stems entirely from the natural staple length.',
    durabilityRating: '15+ Years with proper comb care',
    careProtocol: 'Hand wash in lukewarm water with wool detergent. Dry flat on towel. Store with cedar balls.',
  },
  {
    id: 'damascus-steel',
    name: '67-Layer VG-10 Core Damascus Blade Steel',
    category: 'Metals & Alloys',
    origin: 'Seki City, Gifu Prefecture, Japan',
    certification: 'Seki Cutlery Association Guild Authenticity Seal',
    certificationId: 'SEKI-VG10-CORE-67L',
    specifications: 'Vacuum heat-treated core HRC 60–62 hardness, 33 outer folded layers of SUS410 stainless per side, 15° hand-honed blade edge.',
    description: 'Layered by master bladesmiths using centuries of katana-forging techniques. Offers razor-sharp slicing precision with elastic toughness that prevents micro-chipping.',
    durabilityRating: 'Lifetime (With regular whetstone honing)',
    careProtocol: 'Hand wash immediately after use, dry thoroughly with cloth. Never place in automatic dishwasher.',
  },
  {
    id: 'architectural-brass',
    name: 'Solid Architectural C36000 Lead-Free Brass',
    category: 'Metals & Alloys',
    origin: 'Birmingham Brass Guild, United Kingdom',
    certification: 'RoHS 3 Compliant & ISO 9001 European Metallurgy',
    certificationId: 'UK-BHM-BRASS-551',
    specifications: 'Uncoated solid billet lathe-turned and knurled hardware with natural antimicrobial properties.',
    description: 'We leave our brass untreated without cheap clear synthetic lacquer. Over months of handling, finger oils catalyze a rich, golden-brown antique patina unique to your touch.',
    durabilityRating: 'Lifetime (Solid through-and-through alloy)',
    careProtocol: 'Leave unpolished for natural antique patina, or restore to mirrored shine with mild lemon and baking soda.',
  },
];

interface MaterialTransparencyPageProps {
  onNavigateToPage?: (pageId: 'about' | 'sustainability' | 'journal') => void;
}

export const MaterialTransparencyPage: React.FC<MaterialTransparencyPageProps> = ({ onNavigateToPage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingMaterial, setInspectingMaterial] = useState<MaterialItem | null>(null);

  const categories = ['All', 'Leather', 'Denim & Textiles', 'Metals & Alloys', 'Wool & Cashmere'];

  const filteredMaterials = useMemo(() => {
    return RAW_MATERIALS.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.certification.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-16">
      {/* Intro Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 text-xs text-amber-500 font-mono uppercase tracking-widest font-semibold">
            <span>Material Provenance</span>
            <span aria-hidden="true">&bull;</span>
            <span>100% Traced Registry</span>
            <span aria-hidden="true">&bull;</span>
            <span>Certified Origins</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-[1.15] tracking-tight">
            Nothing concealed. Every origin verifiable.
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            Luxury brands frequently mask substandard synthetic blends behind marketing jargon. At Shopaxe, we publish the full supply-chain documentation, mill origin, alloy rating, and certification ID of every raw component we touch.
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              All materials adhere strictly to European REACH chemical limits, Californian Prop 65 safety regulations, and fair-trade wage audits.
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-neutral-800 shadow-xl group bg-neutral-900">
            <img
              src={selvedgeTitaniumImg}
              alt="Shopaxe Selvedge Denim and Titanium Hardware"
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Okayama Loom 04
              </span>
              <p className="text-xs text-white/90 font-light mt-1">
                Selvedge shuttle edge resting adjacent to custom CNC-milled Grade 5 titanium stud hardware.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Material Filter & Search Toolbar */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-neutral-900 rounded-2xl overflow-x-auto border border-stone-200 dark:border-neutral-800">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search origin, alloy, fiber..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 flex flex-col justify-between hover:shadow-lg transition-shadow space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                  <span>{item.category}</span>
                  <span className="text-amber-500 font-bold">{item.certificationId}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                  {item.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{item.origin}</span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-neutral-800 space-y-3">
                <div className="text-[11px] space-y-1">
                  <span className="text-neutral-400 font-mono uppercase block text-[10px]">Specifications</span>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium">{item.specifications}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectingMaterial(item)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>View Audit Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Audit Modal */}
      {inspectingMaterial && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 shadow-2xl space-y-6 relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold block">
                  Official Mill Audit Document
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {inspectingMaterial.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingMaterial(null)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Provenance Location:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{inspectingMaterial.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Certification Body:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{inspectingMaterial.certification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Registry Seal ID:</span>
                  <span className="font-mono text-amber-500 font-bold">{inspectingMaterial.certificationId}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-neutral-900 dark:text-white block mb-1">Durability &amp; Stress Tolerance</span>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                  {inspectingMaterial.durabilityRating}
                </p>
              </div>

              <div>
                <span className="font-bold text-neutral-900 dark:text-white block mb-1">Atelier Care Protocol</span>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                  {inspectingMaterial.careProtocol}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectingMaterial(null)}
              className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation Link */}
      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold">Read Field Notes from the Atelier</h3>
          <p className="text-xs text-neutral-400 font-light max-w-lg">
            Dive into our Design Journal to read essays on why selvedge weight matters, how chestnut tannin behaves, and the acoustics of calm.
          </p>
        </div>

        {onNavigateToPage && (
          <button
            type="button"
            onClick={() => onNavigateToPage('journal')}
            className="px-6 py-3 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-200 transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Open Design Journal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
