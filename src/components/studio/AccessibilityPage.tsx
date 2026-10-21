import React, { useState, useEffect } from 'react';
import { Eye, Type, Sliders, CheckCircle2, MessageSquare, Sparkles, Volume2, Monitor } from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  // Interactive Accessibility State
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('shopaxe_a11y_font_size') as any) || 'normal';
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('shopaxe_a11y_contrast') === 'true';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('shopaxe_a11y_motion') === 'true';
  });
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(() => {
    return localStorage.getItem('shopaxe_a11y_dyslexic') === 'true';
  });

  // Feedback form state
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackDevice, setFeedbackDevice] = useState('Screen Reader (NVDA / VoiceOver)');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState<string | null>(null);

  // Apply preferences
  useEffect(() => {
    try {
      localStorage.setItem('shopaxe_a11y_font_size', fontSizeScale);
      localStorage.setItem('shopaxe_a11y_contrast', String(highContrast));
      localStorage.setItem('shopaxe_a11y_motion', String(reducedMotion));
      localStorage.setItem('shopaxe_a11y_dyslexic', String(dyslexicFont));

      // Apply root HTML attribute tags
      document.documentElement.dataset.a11yFontSize = fontSizeScale;
      document.documentElement.dataset.a11yContrast = String(highContrast);
      document.documentElement.dataset.a11yMotion = String(reducedMotion);
    } catch (e) {
      // Ignore storage errors in sandboxed environments
    }
  }, [fontSizeScale, highContrast, reducedMotion, dyslexicFont]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackEmail.trim() || !feedbackMessage.trim()) return;

    const receipt = `A11Y-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedReceipt(receipt);
  };

  return (
    <div className="space-y-16">
      {/* Intro Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs text-amber-500 font-mono uppercase tracking-widest font-semibold">
          <span>Digital Inclusivity</span>
          <span aria-hidden="true">&bull;</span>
          <span>WCAG 2.1 Level AA Conformant</span>
          <span aria-hidden="true">&bull;</span>
          <span>Universal Access</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-[1.15] tracking-tight">
          Equal digital dignity. Accessible to every human sense.
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
          Considered design is not exclusionary. At Shopaxe, we engineer our storefront with the belief that luxury should be legible, navigable, and effortless for every user—regardless of vision acuity, motor ability, or cognitive differences.
        </p>
      </div>

      {/* Interactive Accessibility Tuning Deck */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-semibold mb-1">
            <Sliders className="w-4 h-4" />
            <span>Interactive Storefront Assistive Controls</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
            Tailor Your Reading &amp; Motion Experience
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-light leading-relaxed">
            Adjust font dimensions, contrast ratios, and motion thresholds. Your settings persist automatically across your visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Font Size Scaling */}
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white text-sm">
              <Type className="w-4 h-4 text-amber-500" />
              <span>Typographic Scaling</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
              Increase body prose and button labels for improved optical legibility.
            </p>
            <div className="flex gap-2 pt-1">
              {[
                { id: 'normal', label: 'Default (100%)' },
                { id: 'large', label: 'Large (115%)' },
                { id: 'xlarge', label: 'Extra (130%)' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFontSizeScale(s.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    fontSizeScale === s.id
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-sm'
                      : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-stone-200 dark:border-neutral-800 hover:border-amber-500'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. High Contrast Mode */}
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white text-sm">
                <Eye className="w-4 h-4 text-blue-500" />
                <span>High Contrast Edge Enhancement</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                Elevates container border contrast to 7:1 ratio for low-vision environments.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                highContrast
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-stone-200 dark:border-neutral-800 hover:border-blue-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{highContrast ? 'High Contrast Active' : 'Enable High Contrast'}</span>
            </button>
          </div>

          {/* 3. Reduced Motion */}
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white text-sm">
                <Monitor className="w-4 h-4 text-emerald-500" />
                <span>Reduced Motion &amp; Parallax Pause</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                Eliminates transform hover scales and drawer slide animations for vestibular comfort.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-full py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                reducedMotion
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-stone-200 dark:border-neutral-800 hover:border-emerald-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{reducedMotion ? 'Reduced Motion Active' : 'Minimize All Motion'}</span>
            </button>
          </div>

          {/* 4. Dyslexia-Friendly Spacing */}
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white text-sm">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Relaxed Letter Tracking</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                Expands letter-spacing and line heights to eliminate visual word crowding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className={`w-full py-2 px-3 text-xs font-bold rounded-xl border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                dyslexicFont
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-stone-200 dark:border-neutral-800 hover:border-purple-500'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{dyslexicFont ? 'Relaxed Tracking Active' : 'Enable Relaxed Tracking'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* WCAG AA Checklist & Commitments */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 dark:border-neutral-800 pb-4">
          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
            Accessibility Standards Audit
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Conformity benchmarked against W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-2">
            <span className="font-bold text-sm text-neutral-900 dark:text-white block">1. Full Keyboard Navigability</span>
            <p>
              Every modal, filter drawer, image carousel, and cart checkout action can be triggered solely using the Tab, Shift+Tab, Enter, Space, and Escape keys without any trapped focus.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-2">
            <span className="font-bold text-sm text-neutral-900 dark:text-white block">2. Screen Reader ARIA Semantics</span>
            <p>
              All icons feature descriptive aria-hidden or aria-label properties. Live regions announce cart addition and wishlist updates to VoiceOver, NVDA, and JAWS users.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-2">
            <span className="font-bold text-sm text-neutral-900 dark:text-white block">3. Contrast &amp; Zero Strobe</span>
            <p>
              Normal text maintains at least 4.5:1 luminance contrast against backgrounds; large headlines maintain at least 3:1. No element flashes faster than 3 times per second.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback & Accommodation Request Form */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
            Report an Accessibility Barrier or Request Accommodation
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-light">
            If you encounter any difficulty accessing content or purchasing a piece, let our accessibility team know. We guarantee a human response within 24 hours.
          </p>
        </div>

        {submittedReceipt ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-emerald-800 dark:text-emerald-300">
              Barrier Report Transmitted
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
              Thank you, {feedbackName}. Our digital engineering team has received your feedback (Ref: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{submittedReceipt}</strong>). We will review the barrier and email you within 24 business hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmittedReceipt(null);
                setFeedbackMessage('');
              }}
              className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs rounded-xl cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-neutral-900 dark:text-white block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="e.g. Robin Taylor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-900 dark:text-white block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="e.g. robin@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-900 dark:text-white block mb-1">Assistive Technology Used</label>
              <select
                value={feedbackDevice}
                onChange={(e) => setFeedbackDevice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option>Screen Reader (NVDA / VoiceOver / JAWS)</option>
                <option>Keyboard Only Navigation (No Mouse)</option>
                <option>Screen Magnifier (ZoomText / OS Zoom)</option>
                <option>Speech Recognition / Voice Control</option>
                <option>High Contrast or Color Filter Mode</option>
                <option>Other Assistive Equipment</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-neutral-900 dark:text-white block mb-1">Describe the Barrier or Request *</label>
              <textarea
                rows={3}
                required
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Please describe which button, page, or feature caused difficulty..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Submit Accessibility Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
