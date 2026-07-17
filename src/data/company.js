// ─────────────────────────────────────────────────────────────────────────
//  ⚠️  ACTION REQUIRED BEFORE GO-LIVE
//  Replace every value marked TODO with the business's real legal details.
//  These are shown on the legal pages and in the footer and are legally
//  required for a UK business website (Companies Act 2006 / E-Commerce
//  Regulations 2002 / UK GDPR). Do NOT guess these — use the real values.
// ─────────────────────────────────────────────────────────────────────────

export const COMPANY = {
  tradingName: 'Eco Futures',

  // The exact registered name. If you trade as a sole trader/partnership,
  // set isLtd:false and put your own/business name here.
  legalName: 'Eco Futures Ltd', // TODO confirm
  isLtd: true, // TODO false if you are a sole trader / partnership

  // Only used when isLtd is true:
  companyNumber: '[Company number]', // TODO Companies House registration number
  placeOfRegistration: 'England & Wales',

  // Required on a UK business website (a real geographic address, not a PO box):
  registeredOffice: '[Registered office address]', // TODO full postal address

  // Leave '' if not applicable:
  vatNumber: '', // TODO e.g. 'GB123456789' if VAT registered
  icoNumber: '', // TODO ICO data-protection register reference (see note in Privacy page)

  // Contact
  email: 'Info@ecofutures.uk',
  phone: '07359 069886',
  phoneHref: '+447359069886',
  area: 'Preston, Blackpool and the North West',

  // Update whenever you edit the policies
  lastUpdated: '17 July 2026',
}

// True while a field still holds its placeholder, so the UI can flag it.
export const isPlaceholder = (value) =>
  typeof value === 'string' && value.trim().startsWith('[')
