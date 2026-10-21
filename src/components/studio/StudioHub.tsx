import React, { useEffect } from 'react';
import { ChevronRight, ArrowLeft, Store, Sparkles, Shield, Compass } from 'lucide-react';
import { StudioLegalPageId, STUDIO_PAGES } from './studioTypes';
import { AboutPage } from './AboutPage';
import { SustainabilityPage } from './SustainabilityPage';
import { MaterialTransparencyPage } from './MaterialTransparencyPage';
import { DesignJournalPage } from './DesignJournalPage';
import { CareersPage } from './CareersPage';
import { PrivacyPolicyPage } from './PrivacyPolicyPage';
import { TermsOfServicePage } from './TermsOfServicePage';
import { AccessibilityPage } from './AccessibilityPage';
import { CookiePreferencesPage } from './CookiePreferencesPage';

interface StudioHubProps {
  activePage: StudioLegalPageId;
  onSelectPage: (pageId: StudioLegalPageId) => void;
  onBackToStore: () => void;
  onNavigateToCategory?: (category: string) => void;
}

export const StudioHub: React.FC<StudioHubProps> = ({
  activePage,
  onSelectPage,
  onBackToStore,
  onNavigateToCategory,
}) => {
  // Find current config
  const currentConfig = STUDIO_PAGES.find((p) => p.id === activePage) || STUDIO_PAGES[0];

  const studioGroup = STUDIO_PAGES.filter((p) => p.category === 'Our Studio');
  const legalGroup = STUDIO_PAGES.filter((p) => p.category === 'Legal & Security');

  // Scroll to top when activePage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Sub-Header Breadcrumb & Top Bar */}
      <div className="border-b border-stone-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-light" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={onBackToStore}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span>{currentConfig.category}</span>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="text-neutral-900 dark:text-white font-semibold">{currentConfig.title}</span>
          </nav>

          {/* Quick Return Action */}
          <button
            type="button"
            onClick={onBackToStore}
            className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-stone-200 dark:border-neutral-800 bg-stone-50 hover:bg-stone-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </button>
        </div>

        {/* Global Navigation Bar across all 9 pages */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 text-xs whitespace-nowrap min-w-max">
            {/* Our Studio Links */}
            <div className="flex items-center gap-1.5 pr-4 border-r border-stone-200 dark:border-neutral-800">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold mr-2">
                Our Studio:
              </span>
              {studioGroup.map((page) => {
                const isActive = activePage === page.id;
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => onSelectPage(page.id)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    {page.title}
                  </button>
                );
              })}
            </div>

            {/* Legal & Security Links */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold mr-2">
                Legal &amp; Security:
              </span>
              {legalGroup.map((page) => {
                const isActive = activePage === page.id;
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => onSelectPage(page.id)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    {page.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {activePage === 'about' && (
          <AboutPage
            onNavigateToCategory={onNavigateToCategory}
            onNavigateToPage={onSelectPage}
          />
        )}

        {activePage === 'sustainability' && (
          <SustainabilityPage
            onNavigateToPage={onSelectPage}
          />
        )}

        {activePage === 'materials' && (
          <MaterialTransparencyPage
            onNavigateToPage={onSelectPage}
          />
        )}

        {activePage === 'journal' && (
          <DesignJournalPage
            onNavigateToCategory={onNavigateToCategory}
            onNavigateToPage={onSelectPage}
          />
        )}

        {activePage === 'careers' && (
          <CareersPage />
        )}

        {activePage === 'privacy' && (
          <PrivacyPolicyPage />
        )}

        {activePage === 'terms' && (
          <TermsOfServicePage />
        )}

        {activePage === 'accessibility' && (
          <AccessibilityPage />
        )}

        {activePage === 'cookies' && (
          <CookiePreferencesPage />
        )}
      </div>
    </div>
  );
};
