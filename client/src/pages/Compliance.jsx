import { useState, useMemo } from 'react';

const STANDARDS = [
  { id: 1, code: 'ISO 9001:2015', title: 'Quality Management Systems', category: 'ISO', status: 'compliant', lastAudit: '2025-11-14', nextReview: '2026-11-14', owner: 'Quality Dept', score: 94 },
  { id: 2, code: 'ISO 14001:2015', title: 'Environmental Management Systems', category: 'ISO', status: 'at-risk', lastAudit: '2025-08-03', nextReview: '2026-06-30', owner: 'EHS Team', score: 71 },
  { id: 3, code: 'ASME B31.3-2022', title: 'Process Piping', category: 'ASME', status: 'compliant', lastAudit: '2025-12-01', nextReview: '2026-12-01', owner: 'Mechanical Eng', score: 98 },
  { id: 4, code: 'ASME VIII Div.1', title: 'Pressure Vessel Design', category: 'ASME', status: 'compliant', lastAudit: '2025-10-22', nextReview: '2026-10-22', owner: 'Mechanical Eng', score: 91 },
  { id: 5, code: 'ASTM A36/A36M', title: 'Structural Steel Specification', category: 'ASTM', status: 'compliant', lastAudit: '2025-09-15', nextReview: '2026-09-15', owner: 'Structural Eng', score: 100 },
  { id: 6, code: 'ASTM E1820-23', title: 'Fracture Toughness Testing', category: 'ASTM', status: 'non-compliant', lastAudit: '2024-12-10', nextReview: '2025-06-10', owner: 'Materials Lab', score: 42 },
  { id: 7, code: 'IEEE 519-2022', title: 'Harmonic Control in Power Systems', category: 'IEEE', status: 'at-risk', lastAudit: '2025-07-18', nextReview: '2026-07-18', owner: 'Electrical Eng', score: 68 },
  { id: 8, code: 'IEEE 1584-2018', title: 'Arc-Flash Hazard Calculations', category: 'IEEE', status: 'compliant', lastAudit: '2025-11-30', nextReview: '2026-11-30', owner: 'Electrical Eng', score: 89 },
  { id: 9, code: 'OSHA 1910.119', title: 'Process Safety Management', category: 'OSHA', status: 'compliant', lastAudit: '2025-10-05', nextReview: '2026-04-05', owner: 'EHS Team', score: 87 },
  { id: 10, code: 'OSHA 1926.502', title: 'Fall Protection Systems', category: 'OSHA', status: 'non-compliant', lastAudit: '2025-05-20', nextReview: '2025-11-20', owner: 'Safety Dept', score: 55 },
  { id: 11, code: 'ISO 45001:2018', title: 'Occupational Health & Safety', category: 'ISO', status: 'at-risk', lastAudit: '2025-09-01', nextReview: '2026-09-01', owner: 'EHS Team', score: 74 },
  { id: 12, code: 'NFPA 70E-2024', title: 'Electrical Safety in the Workplace', category: 'NFPA', status: 'compliant', lastAudit: '2026-01-10', nextReview: '2026-07-10', owner: 'Electrical Eng', score: 93 },
];

const ALERTS = [
  { id: 1, type: 'overdue', standard: 'ASTM E1820-23', message: 'Review was due 2025-06-10 — remediation plan required', severity: 'high' },
  { id: 2, type: 'overdue', standard: 'OSHA 1926.502', message: 'Review overdue since 2025-11-20 — corrective action in progress', severity: 'high' },
  { id: 3, type: 'upcoming', standard: 'ISO 14001:2015', message: 'Next audit due 2026-06-30 — gap assessment recommended', severity: 'medium' },
  { id: 4, type: 'upcoming', standard: 'OSHA 1910.119', message: 'Scheduled review on 2026-04-05 — documentation ready', severity: 'low' },
  { id: 5, type: 'update', standard: 'ASME B31.3', message: 'ASME published errata for B31.3-2022 — verify current procedures', severity: 'medium' },
  { id: 6, type: 'update', standard: 'NFPA 70E-2024', message: 'Updated edition supersedes 2021 version — training refresh due', severity: 'low' },
];

const CATEGORIES = ['All', 'ISO', 'ASME', 'ASTM', 'IEEE', 'OSHA', 'NFPA'];

const STATUS_META = {
  compliant: { label: 'Compliant', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800' },
  'at-risk': { label: 'At Risk', dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800' },
  'non-compliant': { label: 'Non-Compliant', dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800' },
};

const SEVERITY_META = {
  high: { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400', label: 'High' },
  medium: { bar: 'bg-amber-400', text: 'text-amber-600 dark:text-amber-400', label: 'Medium' },
  low: { bar: 'bg-blue-400', text: 'text-blue-600 dark:text-blue-400', label: 'Low' },
};

const TYPE_ICON = {
  overdue: '⚠',
  upcoming: '◷',
  update: '↻',
};

function ScoreBar({ score }) {
  const color = score >= 85 ? 'bg-emerald-500' : score >= 65 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400 w-7 text-right">{score}%</span>
    </div>
  );
}

export default function Compliance() {
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const filtered = useMemo(() => {
    return STANDARDS.filter((s) => {
      if (category !== 'All' && s.category !== category) return false;
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (search && !s.code.toLowerCase().includes(search.toLowerCase()) && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, statusFilter, search]);

  const counts = useMemo(() => ({
    total: STANDARDS.length,
    compliant: STANDARDS.filter((s) => s.status === 'compliant').length,
    atRisk: STANDARDS.filter((s) => s.status === 'at-risk').length,
    nonCompliant: STANDARDS.filter((s) => s.status === 'non-compliant').length,
    overallScore: Math.round(STANDARDS.reduce((a, s) => a + s.score, 0) / STANDARDS.length),
  }), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Standards Compliance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track engineering standards, audit schedules, and compliance status across all departments.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Overall Score</span>
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{counts.overallScore}%</span>
          <div className="mt-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${counts.overallScore}%` }} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide block">Total</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 block">{counts.total}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Standards tracked</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block">Compliant</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 block">{counts.compliant}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{Math.round((counts.compliant / counts.total) * 100)}% of total</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide block">At Risk</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 block">{counts.atRisk}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Needs attention</span>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide block">Non-Compliant</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 block">{counts.nonCompliant}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Action required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Standards table */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search by code or title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-48 text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    category === c
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="compliant">Compliant</option>
              <option value="at-risk">At Risk</option>
              <option value="non-compliant">Non-Compliant</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-36">Standard</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-28">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-32">Score</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-28">Next Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">
                      No standards match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const meta = STATUS_META[s.status];
                    const isSelected = selectedRow === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedRow(isSelected ? null : s.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-brand-50 dark:bg-brand-900/10'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {s.code}
                        </td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200 text-xs">{s.title}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 w-32">
                          <ScoreBar score={s.score} />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.nextReview}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {selectedRow && (() => {
            const s = STANDARDS.find((x) => x.id === selectedRow);
            if (!s) return null;
            const meta = STATUS_META[s.status];
            return (
              <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/40">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{s.code}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{s.title}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 dark:text-gray-500">Category</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{s.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-gray-500">Owner</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{s.owner}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-gray-500">Last Audit</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{s.lastAudit}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 dark:text-gray-500">Next Review</p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{s.nextReview}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
            Showing {filtered.length} of {STANDARDS.length} standards
          </div>
        </div>

        {/* Alerts panel */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Alerts & Notifications</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Overdue reviews, upcoming deadlines, standard updates</p>
          </div>

          <div className="flex-1 divide-y divide-gray-50 dark:divide-gray-800/60 overflow-y-auto">
            {ALERTS.map((alert) => {
              const sev = SEVERITY_META[alert.severity];
              return (
                <div key={alert.id} className="px-4 py-3 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <div className={`mt-0.5 w-0.5 rounded-full shrink-0 self-stretch ${sev.bar}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base leading-none">{TYPE_ICON[alert.type]}</span>
                      <span className="text-xs font-semibold font-mono text-gray-700 dark:text-gray-300 truncate">{alert.standard}</span>
                      <span className={`ml-auto text-xs font-medium shrink-0 ${sev.text}`}>{sev.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>{ALERTS.filter((a) => a.severity === 'high').length} high-priority items</span>
              <span>{ALERTS.length} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Compliance by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.filter((c) => c !== 'All').map((cat) => {
            const items = STANDARDS.filter((s) => s.category === cat);
            const avg = Math.round(items.reduce((a, s) => a + s.score, 0) / items.length);
            const color = avg >= 85 ? 'text-emerald-600 dark:text-emerald-400' : avg >= 65 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
            const barColor = avg >= 85 ? 'bg-emerald-500' : avg >= 65 ? 'bg-amber-400' : 'bg-red-500';
            return (
              <div key={cat} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{cat}</span>
                  <span className={`text-xs font-bold ${color}`}>{avg}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${avg}%` }} />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{items.length} standard{items.length !== 1 ? 's' : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
