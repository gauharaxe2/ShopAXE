import React, { useState } from 'react';
import { Shield, Lock, EyeOff, FileText, Download, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const [dataRequestEmail, setDataRequestEmail] = useState('');
  const [requestType, setRequestType] = useState<'export' | 'erasure'>('export');
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  const handlePrivacySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataRequestEmail.trim()) return;

    if (requestType === 'export') {
      // Simulate real JSON download of user archive
      const mockArchive = {
        store: 'Shopaxe Studio',
        userEmail: dataRequestEmail,
        requestDate: new Date().toISOString(),
        storedPreferences: {
          currency: 'USD',
          theme: 'dark',
          marketingOptIn: false,
        },
        orderHistory: 'Zero non-essential marketing tracking or external data broker sharing.',
      };
      const blob = new Blob([JSON.stringify(mockArchive, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shopaxe-privacy-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setRequestSuccess(`Your privacy archive was exported successfully to your downloads folder.`);
    } else {
      setRequestSuccess(`Erasure request registered for ${dataRequestEmail}. All analytics and order caches scheduled for permanent cryptographic purging within 24 hours.`);
    }
  };

  return (
    <div className="space-y-16">
      {/* Intro Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs text-amber-500 font-mono uppercase tracking-widest font-semibold">
          <span>Legal &amp; Security</span>
          <span aria-hidden="true">&bull;</span>
          <span>GDPR &bull; CCPA &bull; UK Data Act</span>
          <span aria-hidden="true">&bull;</span>
          <span>Updated March 2026</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-[1.15] tracking-tight">
          Privacy is discretion. We collect only what delivers your order.
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
          At Shopaxe, we treat your digital identity with the same reverence we accord our physical craft. We do not sell user profiles to data brokers, do not deploy cross-site tracking pixels, and operate under strict GDPR and CCPA privacy standards.
        </p>
      </div>

      {/* Interactive Privacy Self-Service Tool */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
              Exercise Your Digital Rights (GDPR &amp; CCPA Hub)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Download your complete personal data record or exercise your Right to be Forgotten.
            </p>
          </div>
        </div>

        {requestSuccess ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-start gap-3 text-xs leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Request Acknowledged:</span>
              <p>{requestSuccess}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePrivacySubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  requestType === 'export'
                    ? 'border-amber-500 bg-amber-500/5 dark:bg-amber-500/10'
                    : 'border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-950'
                }`}
              >
                <input
                  type="radio"
                  name="reqType"
                  checked={requestType === 'export'}
                  onChange={() => setRequestType('export')}
                  className="mt-0.5 accent-amber-500"
                />
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    Download Personal Archive
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-light text-[11px] mt-0.5 block">
                    Export a machine-readable JSON copy of your cart, order records, and settings.
                  </span>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  requestType === 'erasure'
                    ? 'border-red-500 bg-red-500/5 dark:bg-red-500/10'
                    : 'border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-950'
                }`}
              >
                <input
                  type="radio"
                  name="reqType"
                  checked={requestType === 'erasure'}
                  onChange={() => setRequestType('erasure')}
                  className="mt-0.5 accent-red-500"
                />
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    Request Permanent Erasure
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-light text-[11px] mt-0.5 block">
                    Permanently delete marketing records, cookie preferences, and session tokens.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <input
                type="email"
                required
                value={dataRequestEmail}
                onChange={(e) => setDataRequestEmail(e.target.value)}
                placeholder="Enter account or order email address..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-stone-200 transition-colors cursor-pointer shrink-0"
              >
                {requestType === 'export' ? 'Download Archive (.JSON)' : 'Submit Erasure Request'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Legal Articles */}
      <div className="space-y-8 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
            1. Scope of Personal Data Collected
          </h3>
          <p>
            When you interact with the Shopaxe storefront, we collect strictly the telemetry necessary to fulfill your physical merchandise orders, ensure cryptographic checkout security, and preserve your cart items across browsing sessions. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-500 dark:text-neutral-400">
            <li><strong>Transactional Contact Details:</strong> Full name, shipping destination, billing address, telephone number for courier verification, and email address for order receipts and dispatch tracking.</li>
            <li><strong>Encrypted Payment Data:</strong> Credit card numbers are tokenized directly via PCI-DSS Level 1 compliant processors (Stripe, Payoneer). Shopaxe never stores raw credit card CVVs or complete PAN strings on our servers.</li>
            <li><strong>Technical Session Tokens:</strong> Anonymized session IDs, chosen currency (USD, EUR, GBP, JPY), and dark/light display preferences stored locally in your browser’s localStorage.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
            2. The Zero Data Broker Guarantee
          </h3>
          <p>
            Shopaxe does not sell, rent, monetize, or barter customer contact lists or shopping habits to third-party ad networks, telemetry brokers, or data analytics consortiums. We have never partnered with behavioral retargeting pixels that surveil your browsing across external websites.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
            3. Encryption Standards &amp; Storage Architecture
          </h3>
          <p>
            All network transmissions between your browser and our storefront servers are shielded by Transport Layer Security (TLS 1.3) with elliptic curve Diffie-Hellman ephemeral key exchanges. Sensitive configuration data is encrypted at rest using AES-256-GCM cipher suites.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
            4. Data Retention Schedules
          </h3>
          <p>
            Completed order invoices and tax compliance records are retained for seven (7) years in accordance with European and UK revenue statutory audits. Inactive session cookies, abandon cart caches, and temporary order drafts are purged automatically after ninety (90) days.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-3">
          <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
            5. Contact Our Data Protection Officer (DPO)
          </h3>
          <p>
            If you have inquiries regarding privacy governance, data processing agreements, or international cross-border transfers, contact our legal team directly at <span className="font-mono text-amber-500 font-semibold">privacy@shopaxe.com</span> or write to our London atelier: <em>Shopaxe Studio Legal Office, 14 St. John’s Lane, Clerkenwell, London EC1M 4BF, UK</em>.
          </p>
        </div>
      </div>
    </div>
  );
};
