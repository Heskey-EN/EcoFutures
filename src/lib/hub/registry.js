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
  PiggyBank,
  LayoutTemplate,
} from 'lucide-react'

// Ordered by the suite integration plan (CLAUDE.md §3).
export const APPS = [
  {
    slug: 'jobs',
    name: 'Retrofit Job Manager',
    tagline: 'Job docs, timelines and status tracking for every property.',
    icon: Briefcase,
    status: 'joining', // flip to 'live' once jobs.ecofutures.uk is deployed
    url: 'https://jobs.ecofutures.uk',
    minLevel: 1,
  },
  {
    slug: 'business',
    name: 'Business Hub',
    tagline: 'Job calendar, expenses, tax estimates and instant invoices.',
    icon: PiggyBank,
    status: 'joining', // flip to 'live' once business.ecofutures.uk is deployed
    url: 'https://business.ecofutures.uk',
    minLevel: 3, // finances are Organisation Admin territory
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
