// The four-tier access system — the SINGLE permission config for the suite.
// UI code asks `can(level, 'jobs.delete')`; never scatter `if (level === 2)`
// checks around the codebase. RLS in Supabase is the real enforcement — this
// file only decides what the UI shows (CLAUDE.md §4).

export const LEVELS = {
  OFFICE: 1,
  SENIOR: 2,
  ORG_ADMIN: 3,
  MASTER: 4,
}

export const LEVEL_INFO = {
  1: {
    name: 'Office Worker',
    blurb: 'Add comments and upload files',
  },
  2: {
    name: 'Senior Worker',
    blurb: 'Everything Office can do, plus delete jobs',
  },
  3: {
    name: 'Organisation Admin',
    blurb: 'Sees and manages everything in the organisation',
  },
  4: {
    name: 'Master Admin',
    blurb: 'Platform owner — all organisations, all users',
  },
}

// action → minimum access level required
const ACTIONS = {
  'comments.add': LEVELS.OFFICE,
  'files.upload': LEVELS.OFFICE,
  'jobs.delete': LEVELS.SENIOR,
  'records.delete': LEVELS.ORG_ADMIN,
  'org.view_all': LEVELS.ORG_ADMIN,
  'org.manage_users': LEVELS.ORG_ADMIN,
  'platform.view_all': LEVELS.MASTER,
}

// Unknown actions are denied — misspelling a permission fails closed.
export const can = (accessLevel, action) =>
  (accessLevel ?? 0) >= (ACTIONS[action] ?? Infinity)

export const levelName = (accessLevel) => LEVEL_INFO[accessLevel]?.name ?? 'No access'
