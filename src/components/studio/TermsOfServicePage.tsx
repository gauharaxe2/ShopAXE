import React, { useState } from 'react';
import { Scale, FileCheck, Truck, RefreshCw, Shield, AlertTriangle, ChevronDown } from 'lucide-react';

interface TermSection {
  id: string;
  title: string;
  summary: string;
  details: string[];
}

const TERM_SECTIONS: TermSection[] = [
  {
    id: 'sale-contract',
    title: '1. Storefront Transactions & Order Acceptance',
    summary: 'How binding purchase orders are established between you and Shopaxe Inc.',
    details: [
      'By placing an order through the Shopaxe digital storefront, you submit an offer to purchase the specified merchandise subject to these Terms.',
      'Order acceptance occurs when we transmit a digital dispatch confirmation containing your parcel tracking number. We reserve the right to decline or cancel orders in cases of stock exhaustion, typographical pricing errors, or suspected unauthorized payment activity.',
      'All listed prices are displayed in your selected currency (USD, EUR, GBP, or JPY) inclusive of applicable value-added taxes where required by law.',
    ],
  },
  {
    id: 'payment-terms',
    title: '2. Payment Methods & Processing Terms',
    summary: 'Approved payment rails, currency settlements, and Cash on Delivery guidelines.',
    details: [
      'We accept major international credit and debit cards (Visa, MasterCard, American Express), Apple Pay, and Payoneer.',
      'For clients residing in Pakistan, Cash on Delivery (COD) is available on orders up to 150,000 PKR. Delivery agents will require exact cash payment upon presentation of physical package and photo ID verification.',
      'All card transactions undergo 3D-Secure biometric or SMS verification. Unauthorized chargebacks submitted in bad faith will be disputed with comprehensive delivery signature telemetry.',
    ],
  },
  {
    id: 'shipping-delivery',
    title: '3. Express Shipping, Duties & Customs',
    summary: 'Tracked worldwide delivery timelines and import customs responsibilities.',
    details: [
      'Complimentary express tracked shipping is provided on all orders exceeding $150 USD equivalent. Orders below this threshold incur flat-rate subsidized delivery fees calculated at checkout.',
      'Dispatch takes place from our Florence or London fulfillment ateliers within 24 to 48 business hours. Typical delivery transit spans 3–5 business days for North America & Europe, and 4–7 business days for Asia and Australia.',
      'International parcels are shipped Delivered At Place (DAP). Import duties, excise fees, and local customs clearance tariffs are the responsibility of the recipient.',
    ],
  },
  {
    id: 'returns-exchanges',
    title: '4. 30-Day Return & Exchange Guarantee',
    summary: 'Conditions for initiating returns, exchanges, or store credits.',
    details: [
      'We accept returns and size exchanges within thirty (30) calendar days of delivery confirmation.',
      'To qualify, merchandise must remain unwashed, unworn, in pristine condition, with all original organic packaging, authenticity seal tags, and dust covers intact.',
      'If an item arrives damaged or exhibits workshop manufacturing defects, Shopaxe provides complimentary prepaid return courier pickup and immediate replacement or full reimbursement.',
    ],
  },
  {
    id: 'lifetime-warranty',
    title: '5. Lifetime Atelier Craft Warranty',
    summary: 'Our permanent commitment to repair, restitch, and maintain your piece.',
    details: [
      'Every Shopaxe leather good, selvedge denim garment, and cutlery piece is backed by our Lifetime Atelier Warranty.',
      'This warranty covers structural failure of stitching, rivets, titanium hardware, zippers, and delamination resulting from normal intended use.',
      'Warranty coverage does not extend to intentional destruction, extreme commercial abuse, or unauthorized third-party alterations.',
    ],
  },
  {
    id: 'ip-copyright',
    title: '6. Intellectual Property & Brand Trademarks',
    summary: 'Protection of Shopaxe designs, patterns, photography, and brand emblems.',
    details: [
      'All visual designs, typography pairings, pattern blueprints, product photography, editorial journal text, and the stylized Shopaxe blade emblem are proprietary intellectual property of Shopaxe Inc.',
      'Replicating, reverse-engineering, or counterfeiting our garment patterns or casting hardware for commercial distribution is strictly prohibited and subject to civil and criminal copyright enforcement.',
    ],
  },
];

export const TermsOfServicePage: React.FC = () => {
  const [openSectionId, setOpenSectionId] = useState<string | null>('sale-contract');

  const toggleSection = (id: string) => {
    setOpenSectionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-16">
      {/* Intro Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs text-amber-500 font-mono uppercase tracking-widest font-semibold">
          <span>Terms &amp; Conditions</span>
          <span aria-hidden="true">&bull;</span>
          <span>Merchant Agreement</span>
          <span aria-hidden="true">&bull;</span>
          <span>Effective 2026</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-[1.15] tracking-tight">
          Clear, honest terms for considered transactions.
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
          We write our conditions in clear English, free of predatory fine print. These terms define our commitment to honoring lifetime warranties, swift insured delivery, and transparent 30-day returns.
        </p>
      </div>

      {/* Accordion List of Sections */}
      <div className="space-y-4">
        {TERM_SECTIONS.map((sec) => {
          const isOpen = openSectionId === sec.id;
          return (
            <div
              key={sec.id}
              className="rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className="w-full p-6 sm:p-7 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 dark:hover:bg-neutral-850/50 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                    {sec.summary}
                  </p>
                </div>

                <div
                  className={`w-8 h-8 rounded-full bg-stone-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 border-t border-stone-100 dark:border-neutral-800 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light space-y-3">
                  {sec.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legal Inquiries Footer Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-4">
        <h3 className="font-serif text-2xl font-bold">Questions Regarding Storefront Conditions?</h3>
        <p className="text-xs text-neutral-400 font-light max-w-xl leading-relaxed">
          Our customer guild team and legal office are available Monday through Friday. Contact us at <span className="font-mono text-amber-400">legal@shopaxe.com</span> or via WhatsApp at <span className="font-mono text-white">+92 315 7338694</span> for immediate transaction clarity.
        </p>
      </div>
    </div>
  );
};
