import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, Sparkles, CheckCircle2, Upload, FileCheck, Send } from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: 'Craft Atelier' | 'Design & Hardware' | 'Materials Science' | 'Digital Engineering';
  location: string;
  type: string;
  experience: string;
  summary: string;
  responsibilities: string[];
}

const OPEN_POSITIONS: JobPosition[] = [
  {
    id: 'mat-engineer',
    title: 'Senior Materials & Textile Engineer',
    department: 'Materials Science',
    location: 'London & Florence (Hybrid)',
    type: 'Full-time',
    experience: '6+ years',
    summary: 'Lead our zero-waste textile testing protocol, analyzing natural cellulose fibers, organic indigo vat chemistry, and closed-loop recyclability.',
    responsibilities: [
      'Conduct tensile strength and abrasion testing on selvedge denim and wool composites.',
      'Partner with Tuscan tanneries to optimize organic chestnut tannin formulas.',
      'Establish cradle-to-cradle certification data across our full seasonal line.',
    ],
  },
  {
    id: 'ind-designer',
    title: 'Lead Industrial & Hardware Designer',
    department: 'Design & Hardware',
    location: 'London Studio',
    type: 'Full-time',
    experience: '5+ years',
    summary: 'Design tactile consumer hardware, precision titanium accessories, acoustic resonance chambers, and lathe-turned solid brass closures.',
    responsibilities: [
      'Model precision 3D CAD assemblies with 0.02mm CNC tolerances.',
      'Work hands-on in the prototype shop milling metal billets and wood ear-cups.',
      'Refine tactile haptics, magnetic snaps, and ergonomic pivot hinges.',
    ],
  },
  {
    id: 'leather-artisan',
    title: 'Master Leather Artisan & Pattern Maker',
    department: 'Craft Atelier',
    location: 'Florence Atelier, Italy',
    type: 'Full-time',
    experience: '8+ years',
    summary: 'Draft architectural bag and footwear patterns and oversee saddle-stitching apprentices in our Santa Croce workshop.',
    responsibilities: [
      'Hand-cut 3.2mm Tuscan vegetable-tanned hides maximizing natural grain flow.',
      'Execute traditional double-needle French saddle stitching with waxed linen thread.',
      'Mentor guild apprentice craftspeople in leather burnishing and edge finishing.',
    ],
  },
  {
    id: 'frontend-engineer',
    title: 'Full-Stack E-Commerce Experience Engineer',
    department: 'Digital Engineering',
    location: 'Global Remote',
    type: 'Full-time',
    experience: '4+ years',
    summary: 'Architect our digital storefront with zero-latency interactions, tactile micro-animations, and seamless global checkout flows.',
    responsibilities: [
      'Build responsive, accessible, high-performance interfaces in React & TypeScript.',
      'Optimize real-time inventory synchronization and local currency payments.',
      'Ensure WCAG AA accessibility compliance across all digital surfaces.',
    ],
  },
  {
    id: 'editorial-storyteller',
    title: 'Brand Editorial & Visual Storyteller',
    department: 'Design & Hardware',
    location: 'London & Tokyo',
    type: 'Full-time',
    experience: '3+ years',
    summary: 'Document artisan workshops on 35mm film, interview generational bladesmiths, and author field notes for our Design Journal.',
    responsibilities: [
      'Travel to guild workshops in Seki, Okayama, and Tuscany to chronicle craft heritage.',
      'Draft in-depth essays examining material science and considered living.',
      'Maintain Shopaxe’s restrained, poetic editorial tone of voice.',
    ],
  },
];

export const CareersPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [applyingPosition, setApplyingPosition] = useState<JobPosition | null>(null);

  // Form State
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePortfolio, setCandidatePortfolio] = useState('');
  const [candidateNote, setCandidateNote] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<string | null>(null);

  const departments = ['All', 'Craft Atelier', 'Design & Hardware', 'Materials Science', 'Digital Engineering'];

  const filteredPositions = OPEN_POSITIONS.filter(
    (pos) => selectedDepartment === 'All' || pos.department === selectedDepartment
  );

  const handleFakeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const receiptCode = `APPLY-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setSubmittedReceipt(receiptCode);
    }, 900);
  };

  const resetForm = () => {
    setApplyingPosition(null);
    setCandidateName('');
    setCandidateEmail('');
    setCandidatePortfolio('');
    setCandidateNote('');
    setFileName(null);
    setSubmittedReceipt(null);
  };

  return (
    <div className="space-y-16">
      {/* Intro Hero */}
      <div className="max-w-3xl space-y-5">
        <div className="flex items-center gap-2 text-xs text-amber-500 font-mono uppercase tracking-widest font-semibold">
          <span>Guild Culture</span>
          <span aria-hidden="true">&bull;</span>
          <span>Now Hiring</span>
          <span aria-hidden="true">&bull;</span>
          <span>Florence &bull; London &bull; Tokyo &bull; Remote</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white leading-[1.15] tracking-tight">
          Craft with patient hands. Build things that outlive us.
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
          We reject the sprint-and-burnout churn of disposable commerce. At Shopaxe, we provide master artisans, materials scientists, and digital craftsmen with the time, uncompromised material budgets, and autonomy needed to produce work of lasting distinction.
        </p>
      </div>

      {/* Guild Benefits */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 dark:border-neutral-800 pb-4">
          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
            Guild Membership &amp; Care
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            How we support the human lives behind every physical and digital artifact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-2">
            <span className="text-amber-500 font-mono text-xl font-bold block">$2,500 / yr</span>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Craft &amp; Tool Stipend</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Annual unrestricted funding for specialized hand tools, book archives, and personal creative experiments.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-2">
            <span className="text-emerald-500 font-mono text-xl font-bold block">6 Weeks</span>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Paid Sabbatical</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Every three years, team members take six fully paid weeks away to explore crafts, travel, or rest without checking messages.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-2">
            <span className="text-blue-500 font-mono text-xl font-bold block">100%</span>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Comprehensive Health</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Full medical, dental, vision, mental health counseling, and ergonomic physical therapy support worldwide.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 space-y-2">
            <span className="text-purple-500 font-mono text-xl font-bold block">Atelier Exchange</span>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">Cross-Guild Residencies</h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Engineers spend time in the Florence leather workshop; leather crafters study acoustics in London.
            </p>
          </div>
        </div>
      </div>

      {/* Positions Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
              Open Positions ({filteredPositions.length})
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Select a position to view responsibilities and submit your profile.
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-neutral-900 rounded-2xl overflow-x-auto border border-stone-200 dark:border-neutral-800">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDepartment === dept
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-4">
          {filteredPositions.map((pos) => (
            <div
              key={pos.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 hover:border-amber-500/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span>{pos.department}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>{pos.experience}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>{pos.type}</span>
                </div>

                <h4 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                  {pos.title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{pos.location}</span>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed pt-1">
                  {pos.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setApplyingPosition(pos)}
                className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-stone-200 transition-colors shrink-0 cursor-pointer"
              >
                <span>View &amp; Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Drawer / Modal */}
      {applyingPosition && (
        <div className="fixed inset-0 z-50 bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl my-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 shadow-2xl space-y-6 relative">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold block">
                  {applyingPosition.department} &bull; {applyingPosition.location}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  Apply for {applyingPosition.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center cursor-pointer text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {submittedReceipt ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-emerald-800 dark:text-emerald-300">
                  Application Received with Care
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                  Thank you, <strong>{candidateName}</strong>. Your portfolio and profile have been transmitted to our workshop leads. We review every application by hand without automated AI parsing.
                </p>
                <div className="p-3 bg-white dark:bg-neutral-950 rounded-xl inline-block text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Confirmation Code: {submittedReceipt}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Return to Careers
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4 text-xs">
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">Key Responsibilities</span>
                  <ul className="space-y-1 text-neutral-500 dark:text-neutral-400 pl-4 list-disc font-light">
                    {applyingPosition.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-bold text-neutral-900 dark:text-white block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Elena Rossi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-neutral-900 dark:text-white block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="e.g. elena@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-neutral-900 dark:text-white block mb-1">Portfolio, Website, or GitHub URL</label>
                  <input
                    type="url"
                    value={candidatePortfolio}
                    onChange={(e) => setCandidatePortfolio(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-900 dark:text-white block mb-1">Upload Resume / CV (PDF, DOCX)</label>
                  <label className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-stone-300 dark:border-neutral-700 hover:border-amber-500 cursor-pointer bg-stone-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
                    <Upload className="w-4 h-4 text-amber-500" />
                    <span>{fileName ? `Selected: ${fileName}` : 'Choose PDF file or drag here'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFakeFileUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="font-bold text-neutral-900 dark:text-white block mb-1">Tell Us About Your Craft Philosophy</label>
                  <textarea
                    rows={3}
                    value={candidateNote}
                    onChange={(e) => setCandidateNote(e.target.value)}
                    placeholder="What does permanence mean to you? Why work with physical materials?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Profile...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
