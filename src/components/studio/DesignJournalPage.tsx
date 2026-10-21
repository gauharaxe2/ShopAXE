import React, { useState } from 'react';
import { BookOpen, Clock, User, ArrowRight, Share2, Bookmark, Check } from 'lucide-react';

interface JournalArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: string;
  authorRole: string;
  excerpt: string;
  fullBody: string[];
  pullQuote: string;
  catalogCategory: string;
}

const ARTICLES: JournalArticle[] = [
  {
    id: 'selvedge-weight',
    title: 'The Architecture of Weight: Why 14oz Selvedge Outlives Fast Fashion',
    subtitle: 'An inquiry into warp tension, rope dyeing, and the physics of tactile drape.',
    category: 'Textile Engineering',
    readTime: '6 min read',
    publishDate: 'March 14, 2026',
    author: 'Elena Mori',
    authorRole: 'Master Weaver & Textile Archivist, Okayama Guild',
    excerpt: 'Commercial denim is optimized for showroom softness—chemically sandblasted, blended with synthetic elastane, and constructed to fail within thirty washes. Real selvedge treats cotton as structural fiber.',
    pullQuote: 'A garment should not be compliant upon purchase. It must demand time, resistance, and your body’s unique movement to reveal its true geometry.',
    catalogCategory: 'Apparel',
    fullBody: [
      'Commercial fashion treats cotton as disposable pulp. High-speed projectile looms smash fibers across warp threads at velocities that strip natural pectin, producing a fabric that feels instantly soft on the retail rack but quickly disintegrates along stress points.',
      'In contrast, our Okayama shuttle looms operate at a mechanical cadence unchanged since 1968. Wooden shuttles traverse the shed with rhythmic deliberation, tucking the weft thread neatly around the selvedge edges without cutting. This creates a dense, self-finished perimeter that will never unravel.',
      'When you first wear a 14.2oz raw denim trouser, it feels unyielding, almost architectural. This stiffness is not a flaw—it is uncompromised cellulose awaiting your body’s heat. Over months, indigo sheds from high-friction ridges, exposing clean white cotton beneath in patterns that chart your exact lifestyle.',
      'The result is an archival artifact: an article of clothing that fits only you, holds its drape when you stand, and outlives a dozen mass-market equivalents.',
    ],
  },
  {
    id: 'tuscany-tanning',
    title: 'Vegetable Tanning in Tuscany: Chestnut Wood vs Chemical Chromium',
    subtitle: 'How 40 days in organic tannin pits produces leather that breathes, darkens, and heals.',
    category: 'Craft & Heritage',
    readTime: '8 min read',
    publishDate: 'February 28, 2026',
    author: 'Marco Rossi',
    authorRole: 'Third-Generation Tanner, Santa Croce sull’Arno',
    excerpt: 'Over 85% of world leather is tanned in 24 hours using carcinogenic chromium salts. In Tuscany, we still wait forty days for chestnut and mimosa bark to do their patient work.',
    pullQuote: 'Chrome-tanned leather is embalmed plastic. Vegetable-tanned leather is alive—it drinks oil, records sunlight, and ages with dignified grace.',
    catalogCategory: 'Accessories',
    fullBody: [
      'Walk into an industrial chrome tannery, and you are greeted by chemical astringency and steel drums rotating at violent RPMs. Chromium sulfate crosslinks collagen within hours, freezing the hide in a dead, uniform grey before synthetic dyes paint over its surface.',
      'In Santa Croce sull’Arno, our master tanners work to a cadence dictated by nature. Wooden pits are filled with clean river water infused with organic tannin extracts derived from Tuscan chestnut wood, Argentine quebracho, and mimosa bark.',
      'Hides are gently submerged for six weeks. Tannin molecules naturally permeate the fibril lattice, displacing moisture and infusing the leather with warm earthy aromas and self-healing waxes.',
      'Because the leather surface remains porous and unvarnished by synthetic polyurethane coats, it develops what collectors revere as patina. A scratch can be rubbed out with thumb friction; sunlight deepens its hazelnut hue. You are holding organic history.',
    ],
  },
  {
    id: 'acoustics-of-quiet',
    title: 'The Acoustics of Quiet: Engineering Headphone Resonance Chambers',
    subtitle: 'Designing auditory instruments that eliminate listening fatigue in noisy urban landscapes.',
    category: 'Industrial Design',
    readTime: '5 min read',
    publishDate: 'February 10, 2026',
    author: 'James Vance',
    authorRole: 'Acoustics & Materials Lead, London Studio',
    excerpt: 'True luxury in modern cities is auditory peace. We examine the psychoacoustics of chamber volume, natural birch ear-cups, and passive planar drivers.',
    pullQuote: 'Noise reduction is not merely active frequency phase cancellation. It begins with the physical density of acoustic timber.',
    catalogCategory: 'Audio & Tech',
    fullBody: [
      'Modern consumer audio is engineered for instant sensory dopamine: boomy sub-bass and hyper-compressed treble that shocks the eardrum in store listening stations, only to cause debilitating fatigue after 45 minutes.',
      'In our London acoustic workshop, we draft acoustic cavities using anechoic chamber testing and physical timber damping. Solid milled Scandinavian birch absorbs unwanted harmonic standing waves without electronic DSP distortion.',
      'By pairing custom beryllium-coated 50mm drivers with memory foam ear pads sheathed in breathable lambskin, we achieve flat frequency response across the human vocal range.',
      'The music breathes. Instruments sit in three-dimensional physical space. You hear the fingernail striking the classical guitar nylon string, not an algorithm’s digital interpretation.',
    ],
  },
  {
    id: 'kitchen-geometry',
    title: 'Geometry in the Kitchen: Finding the Balance Point of a 210mm Gyuto',
    subtitle: 'Why pinch grip ergonomics, distal taper, and Seki metallurgy transform culinary preparation.',
    category: 'Culinary Metallurgy',
    readTime: '7 min read',
    publishDate: 'January 22, 2026',
    author: 'Kenji Takahashi',
    authorRole: 'Master Bladesmith, Seki Guild',
    excerpt: 'A chef’s knife should not feel like an implement in the hand; it should function as an effortless weightless extension of the index finger and wrist.',
    pullQuote: 'If you have to apply downward force to slice through a ripe tomato skin, the blade has already failed the cook.',
    catalogCategory: 'Home & Living',
    fullBody: [
      'For seven centuries, swordsmiths in Seki, Japan shaped blades for samurai warriors. Today, those identical forging techniques live on in our kitchen cutlery.',
      'Our 210mm Gyuto features a VG-10 high-carbon core folded within 66 exterior layers of Damascus steel. Vacuum heat treatment locks the edge at HRC 61, allowing an acute 15-degree hand-honed bevel that glides through proteins without tearing cellular walls.',
      'Crucially, the center of gravity sits precisely at the choil where the chef’s index finger rests in a traditional pinch grip. This eliminates forearm torque during long mise-en-place sessions.',
      'A great knife invites you into presence. The crisp percussion of blade against hinoki cutting board becomes meditative.',
    ],
  },
];

interface DesignJournalPageProps {
  onNavigateToCategory?: (category: string) => void;
  onNavigateToPage?: (pageId: 'about' | 'materials' | 'careers') => void;
}

export const DesignJournalPage: React.FC<DesignJournalPageProps> = ({ onNavigateToCategory, onNavigateToPage }) => {
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = (article: JournalArticle) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-16">
      {/* Journal Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs text-amber-500 font-mono uppercase tracking-widest font-semibold">
          <span>Field Notes</span>
          <span aria-hidden="true">&bull;</span>
          <span>Vol. IV</span>
          <span aria-hidden="true">&bull;</span>
          <span>Artisan Archives</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-[1.15] tracking-tight">
          Essays on geometry, tactile architecture, and permanence.
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
          Observations, technical blueprints, and philosophical inquiries published directly by our weavers, metallurgists, acoustic engineers, and leather artisans.
        </p>
      </div>

      {/* Featured Lead Article */}
      {ARTICLES.length > 0 && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>{ARTICLES[0].category}</span>
            <span aria-hidden="true">&bull;</span>
            <span>{ARTICLES[0].publishDate}</span>
            <span aria-hidden="true">&bull;</span>
            <span>{ARTICLES[0].readTime}</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-snug">
            {ARTICLES[0].title}
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light max-w-2xl">
            {ARTICLES[0].excerpt}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-stone-100 dark:border-neutral-800">
            <div className="text-xs">
              <span className="font-bold text-neutral-900 dark:text-white">{ARTICLES[0].author}</span>
              <span className="text-neutral-400 block text-[11px]">{ARTICLES[0].authorRole}</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveArticle(ARTICLES[0])}
              className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <span>Read Full Essay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.slice(1).map((article) => (
          <div
            key={article.id}
            className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 flex flex-col justify-between hover:shadow-lg transition-shadow space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                <span>{article.category}</span>
                <span aria-hidden="true">&bull;</span>
                <span>{article.readTime}</span>
              </div>

              <h4 className="font-serif text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                {article.title}
              </h4>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="text-[11px]">
                <span className="font-semibold text-neutral-900 dark:text-white block">{article.author}</span>
                <span className="text-neutral-400">{article.publishDate}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticle(article)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-colors cursor-pointer"
                aria-label={`Read ${article.title}`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal View */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-8 p-6 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 shadow-2xl space-y-8 relative">
            {/* Top Close & Share bar */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span>{activeArticle.category}</span>
                <span aria-hidden="true">&bull;</span>
                <span>{activeArticle.publishDate}</span>
                <span aria-hidden="true">&bull;</span>
                <span>{activeArticle.readTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === activeArticle.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center cursor-pointer text-lg font-bold"
                  aria-label="Close essay"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Article Heading */}
            <div className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
                {activeArticle.title}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light italic">
                {activeArticle.subtitle}
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 font-serif font-bold flex items-center justify-center">
                  {activeArticle.author.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block">{activeArticle.author}</span>
                  <span className="text-[11px] text-neutral-400">{activeArticle.authorRole}</span>
                </div>
              </div>
            </div>

            {/* Pull Quote */}
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 my-6">
              <p className="font-serif italic text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed">
                &ldquo;{activeArticle.pullQuote}&rdquo;
              </p>
            </div>

            {/* Essay Prose */}
            <div className="space-y-5 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
              {activeArticle.fullBody.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-stone-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {onNavigateToCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveArticle(null);
                    onNavigateToCategory(activeArticle.catalogCategory);
                  }}
                  className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore related {activeArticle.catalogCategory} pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Essay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
