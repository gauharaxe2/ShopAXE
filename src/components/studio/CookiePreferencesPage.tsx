import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Check, Sliders, RefreshCw, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface CookieSettings {
  essential: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_COOKIES: CookieSettings = {
  essential: true,
  functional: true,
  analytics: true,
  marketing: false,
};

export const CookiePreferencesPage: React.FC = () => {
  const [settings, setSettings] = useState<CookieSettings>(() => {
    try {
      const saved = localStorage.getItem('shopaxe_cookie_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_COOKIES;
    } catch {
      return DEFAULT_COOKIES;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
    return localStorage.getItem('shopaxe_cookie_updated_at') || null;
  });

  const handleToggle = (key: keyof CookieSettings) => {
    if (key === 'essential') return; // Cannot disable essential cookies
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const time = new Date().toLocaleString();
    try {
      localStorage.setItem('shopaxe_cookie_preferences', JSON.stringify(settings));
      localStorage.setItem('shopaxe_cookie_updated_at', time);
    } catch (e) {
      console.warn('Could not save cookie preferences', e);
    }
    setLastUpdated(time);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAcceptAll = () => {
    const allOn: CookieSettings = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setSettings(allOn);
    const time = new Date().toLocaleString();
    try {
      localStorage.setItem('shopaxe_cookie_preferences', JSON.stringify(allOn));
      localStorage.setItem('shopaxe_cookie_updated_at', time);
    } catch (e) {}
    setLastUpdated(time);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleRejectNonEssential = () => {
    const minimal: CookieSettings = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setSettings(minimal);
    const time = new Date().toLocaleString();
    try {
      localStorage.setItem('shopaxe_cookie_preferences', JSON.stringify(minimal));
      localStorage.setItem('shopaxe_cookie_updated_at', time);
    } catch (e) {}
    setLastUpdated(time);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-10">
      {/* Overview intro */}
      <div className="space-y-4">
        <p className="text-base text-neutral-300 dark:text-neutral-300 leading-relaxed font-light">
          Shopaxe respects your digital boundaries. We believe high-end commerce should operate with total discretion. We only store cookies and browser storage data necessary to ensure frictionless shopping, keep your bag and wishlist synchronized, and prevent fraudulent transactions.
        </p>
        <p className="text-xs text-neutral-400 leading-relaxed font-light">
          Use the granular controls below to customize which categories of digital storage you permit on this device. Your preferences apply across all storefront sessions and can be modified at any time.
        </p>
      </div>

      {/* Control Actions Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-neutral-300">
          <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {lastUpdated ? (
              <>Preferences last saved: <strong className="text-white font-mono">{lastUpdated}</strong></>
            ) : (
              'Default privacy preset active'
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
          >
            Reject Non-Essential
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>

      {/* Granular Toggles List */}
      <div className="space-y-4">
        {/* 1. Essential */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <span>Strictly Essential &amp; Security Storage</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400 border border-neutral-700">
                    Always Active
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Required for site navigation, cryptographic session security, cart checkout, and fraud mitigation.
                </p>
              </div>
            </div>

            <div className="w-12 h-6 rounded-full bg-amber-500/80 p-0.5 flex items-center justify-end cursor-not-allowed opacity-90">
              <div className="w-5 h-5 rounded-full bg-neutral-950 shadow flex items-center justify-center">
                <Check className="w-3 h-3 text-amber-400" />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-light pl-11">
            Includes cookies and local tokens used to retain items in your cart, remember your authenticated session, verify CSRF tokens during payment submission, and guard against bot traffic. These cannot be disabled without rendering the store inoperable.
          </p>
        </div>

        {/* 2. Functional & Aesthetic Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Functional &amp; Storefront Preferences
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Enables persistent dark mode choice, preferred currency, and recently inspected items.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('functional')}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                settings.functional ? 'bg-amber-500 justify-end' : 'bg-neutral-700 justify-start'
              }`}
              aria-label="Toggle functional cookies"
            >
              <div className="w-5 h-5 rounded-full bg-neutral-950 shadow flex items-center justify-center">
                {settings.functional && <Check className="w-3 h-3 text-amber-400" />}
              </div>
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-light pl-11">
            Allows Shopaxe to remember your interface customizations—such as Midnight Cyber dark mode, localized currency (USD, EUR, GBP, JPY, PKR), saved wishlist items, and volume settings for product runway videos.
          </p>
        </div>

        {/* 3. Performance & Anonymized Analytics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Telemetry &amp; Performance Optimization
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Aggregated, anonymized performance measurement to identify slow page loads or broken links.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('analytics')}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                settings.analytics ? 'bg-amber-500 justify-end' : 'bg-neutral-700 justify-start'
              }`}
              aria-label="Toggle analytics cookies"
            >
              <div className="w-5 h-5 rounded-full bg-neutral-950 shadow flex items-center justify-center">
                {settings.analytics && <Check className="w-3 h-3 text-amber-400" />}
              </div>
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-light pl-11">
            Gathers non-identifying telemetry to monitor image loading speeds across global CDNs, search latency, and browser rendering fidelity. No IP addresses or personally identifiable identifiers are ever retained or transmitted to third parties.
          </p>
        </div>

        {/* 4. Marketing & Tailored Capsule Drops */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Personalized Drops &amp; Recommendations
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Tailored suggestions based on materials and categories you admire (e.g. cashmere vs leather).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle('marketing')}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                settings.marketing ? 'bg-amber-500 justify-end' : 'bg-neutral-700 justify-start'
              }`}
              aria-label="Toggle marketing cookies"
            >
              <div className="w-5 h-5 rounded-full bg-neutral-950 shadow flex items-center justify-center">
                {settings.marketing && <Check className="w-3 h-3 text-amber-400" />}
              </div>
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-light pl-11">
            Allows the storefront to highlight capsule releases aligned with your taste profile. We never execute cross-site behavioral tracking or sell telemetry to advertising brokers.
          </p>
        </div>
      </div>

      {/* Save Button & Confirmation Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>

        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-4 py-2 rounded-xl animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences saved successfully to this browser session.</span>
          </div>
        )}
      </div>
    </div>
  );
};
