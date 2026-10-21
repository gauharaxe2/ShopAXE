export type StudioLegalPageId =
  | 'about'
  | 'sustainability'
  | 'materials'
  | 'journal'
  | 'careers'
  | 'privacy'
  | 'terms'
  | 'accessibility'
  | 'cookies';

export interface StudioPageConfig {
  id: StudioLegalPageId;
  title: string;
  category: 'Our Studio' | 'Legal & Security';
  subtitle: string;
  badge?: string;
  path: string;
}

export const STUDIO_PAGES: StudioPageConfig[] = [
  // Our Studio
  {
    id: 'about',
    title: 'About Shopaxe',
    category: 'Our Studio',
    subtitle: 'The philosophy of considered living, artisanal heritage, and minimalist restraint.',
    badge: 'Our Story',
    path: '/about',
  },
  {
    id: 'sustainability',
    title: 'Sustainability Manifesto',
    category: 'Our Studio',
    subtitle: 'Zero-waste production, lifetime garment care, and closed-loop textile circularity.',
    badge: 'Net Zero 2026',
    path: '/sustainability',
  },
  {
    id: 'materials',
    title: 'Material Transparency',
    category: 'Our Studio',
    subtitle: 'Every fiber, hide, alloy, and stone traced to ethical, certified origins.',
    badge: '100% Traced',
    path: '/materials',
  },
  {
    id: 'journal',
    title: 'Design Journal',
    category: 'Our Studio',
    subtitle: 'Editorial essays on geometry, tactile architecture, acoustics, and craft.',
    badge: 'Field Notes',
    path: '/journal',
  },
  {
    id: 'careers',
    title: 'Careers & Atelier',
    category: 'Our Studio',
    subtitle: 'Join master craftspeople, materials engineers, and designers in Florence, London, and Remote.',
    badge: 'Now Hiring',
    path: '/careers',
  },

  // Legal & Security
  {
    id: 'privacy',
    title: 'Privacy Policy',
    category: 'Legal & Security',
    subtitle: 'Rigorous data stewardship, zero tracking monetization, and complete GDPR/CCPA protections.',
    badge: 'Updated 2026',
    path: '/privacy',
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    category: 'Legal & Security',
    subtitle: 'Transparent conditions for storefront transactions, warranties, and international delivery.',
    badge: 'Legal',
    path: '/terms',
  },
  {
    id: 'accessibility',
    title: 'Accessibility Statement',
    category: 'Legal & Security',
    subtitle: 'Equal digital access, WCAG 2.1 AA conformity, and responsive assistive tools.',
    badge: 'WCAG 2.1 AA',
    path: '/accessibility',
  },
  {
    id: 'cookies',
    title: 'Cookie Preferences',
    category: 'Legal & Security',
    subtitle: 'Control functional storage, analytical performance metrics, and session cookies.',
    badge: 'Interactive',
    path: '/cookies',
  },
];
