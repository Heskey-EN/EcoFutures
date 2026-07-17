import LegalPage from '../components/LegalPage.jsx'
import { COOKIE_SETTINGS_EVENT } from '../components/CookieBanner.jsx'
import { COMPANY } from '../data/company.js'

function openSettings() {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))
}

export default function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="What cookies we use, and how to control them."
    >
      <h2>What cookies are</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. Similar
        technologies such as your browser’s local storage work in the same way. They can be
        “essential” (needed for the site to function) or “non-essential” (for example analytics).
      </p>

      <h2>Our approach</h2>
      <p>
        We don’t set any non-essential cookies until you tell us we can. When you first visit, a
        banner asks whether you’re happy for us to use analytics. Until you choose{' '}
        <strong>Accept all</strong>, Google Analytics is never loaded and sets no cookies. You can
        change your choice at any time.
      </p>
      <p>
        <button
          type="button"
          onClick={openSettings}
          className="rounded bg-navy px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-navy-deep"
        >
          Change your cookie settings
        </button>
      </p>

      <h2>Cookies we use</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ecofutures-cookie-consent</td>
            <td>Essential</td>
            <td>Remembers your cookie choice so we don’t ask again (stored in your browser).</td>
            <td>Until you clear it</td>
          </tr>
          <tr>
            <td>_ga, _ga_&lt;id&gt;</td>
            <td>Analytics (only if accepted)</td>
            <td>Set by Google Analytics to measure how visitors use the site.</td>
            <td>Up to 2 years</td>
          </tr>
        </tbody>
      </table>

      <h2>Managing cookies</h2>
      <p>
        As well as the settings button above, you can control or delete cookies through your browser
        settings, and you can opt out of Google Analytics across all sites using Google’s{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
          opt-out browser add-on
        </a>
        . Blocking essential cookies may affect how the site works.
      </p>

      <h2>More information</h2>
      <p>
        For how we handle personal data more generally, see our <a href="/privacy">Privacy Policy</a>.
        Questions? Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </p>
    </LegalPage>
  )
}
