// Small shared formatters for the suite pages.

// Human label for a membership's last_seen heartbeat.
export const lastSeenLabel = (ts) => {
  if (!ts) return 'Never signed in'
  const mins = Math.round((Date.now() - new Date(ts).getTime()) / 60000)
  if (mins < 2) return 'Active now'
  if (mins < 60) return `Seen ${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `Seen ${hours}h ago`
  const days = Math.round(hours / 24)
  return days === 1 ? 'Seen yesterday' : `Seen ${days} days ago`
}

// True when the heartbeat says they're in the suite right now (≤5 min).
export const isActiveNow = (ts) =>
  Boolean(ts) && Date.now() - new Date(ts).getTime() < 5 * 60000
