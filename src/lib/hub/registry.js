// The app registry — SINGLE source of truth for the suite's apps (CLAUDE.md §3).
// Adding an app here makes its tile appear on the Retrofit Suite launcher.
// Do not hardcode app lists anywhere else.
//
// status:
//   'live'    — tile links straight out to `url`
//   'joining' — the app exists but hasn't been wired into the shared login yet
//   'planned' — not built yet
// separateLogin: true while a live app still runs its own account system —
// the tile says so honestly until the app migrates onto the shared session.
import {
  ClipboardList,
  FileSearch,
  PencilRuler,
  Briefcase,
  LayoutTemplate,
  Sun,
} from 'lucide-react'

// Ordered by the suite integration plan (CLAUDE.md §3).
export const APPS = [
  {
    // The Job Manager and Business Hub merged into one app (2026-07-26):
    // jobs for everyone, plus a Finance tab (calendar, expenses, tax,
    // invoices) the app itself gates to Organisation Admins (level 3+).
    slug: 'retromanager',
    name: 'RetroManager',
    tagline: 'Jobs, docs and timelines — plus finances and invoices for admins.',
    icon: Briefcase,
    status: 'live',
    url: 'https://retromanager.ecofutures.uk',
    minLevel: 1,
  },
  {
    slug: 'assessment',
    name: 'Future Forms',
    tagline: 'Build survey forms; capture retrofit assessments in the field.',
    icon: ClipboardList,
    status: 'live', // forms.ecofutures.uk live in suite mode (2026-07-22)
    url: 'https://forms.ecofutures.uk',
    minLevel: 1,
  },
  {
    slug: 'epc',
    name: 'EPC Checker',
    tagline: 'Pre-visit property data and soft-audit for any UK address.',
    icon: FileSearch,
    status: 'live',
    url: 'https://epc-checker.com',
    separateLogin: true,
    minLevel: 1,
  },
  {
    // The suite migration is WRITTEN but not yet DEPLOYED: the Cavwall repo's
    // rewrite is committed locally and 0009_cavwall.sql hasn't been run. Until
    // cavwall.ecofutures.uk actually exists this tile must keep pointing at the
    // live standalone app, which still has its own login.
    // Switch to https://cavwall.ecofutures.uk and drop separateLogin the day
    // that subdomain goes up — see the Cavwall checklist in SETUP.md §6.
    slug: 'cavwall',
    name: 'Cavwall',
    tagline: 'To-scale cavity-wall diagrams and print-ready CWI survey PDFs.',
    icon: PencilRuler,
    status: 'live',
    url: 'https://cavwall.com',
    separateLogin: true,
    minLevel: 1,
  },
  {
    // Suite-native from day one (2026-08-01): hub login only, surveys
    // org-scoped via 0010_solar. Yield is MCS-compliant (kWp × Kk × SF,
    // MIS 3002) — deliberately NOT Google's own estimate, which must never
    // appear on UK paperwork.
    slug: 'solar',
    name: 'Solar Survey',
    tagline: 'Roof-by-roof PV feasibility and array design with MCS yield figures.',
    icon: Sun,
    status: 'joining',
    url: 'https://solar.ecofutures.uk',
    minLevel: 1,
  },
  {
    slug: 'floorplan',
    name: 'Floor Plan Creator',
    tagline: 'Draw floor plans that feed Cav Wall and Assessment forms.',
    icon: LayoutTemplate,
    status: 'planned',
    url: null,
    minLevel: 1,
  },
]

export const STATUS_LABELS = {
  live: 'Live',
  joining: 'Joining the suite',
  planned: 'Planned',
}
