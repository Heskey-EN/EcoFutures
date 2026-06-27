# Eco Futures

Marketing website for **Eco Futures** — accredited EPC assessments and PAS 2035 retrofit surveys across Preston, Blackpool and the North West.

A modern rebuild of the original static site, now a fast single-page app with a unified design system and a working contact form.

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [React Router](https://reactrouter.com/) for client-side routing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [lucide-react](https://lucide.dev/) icons
- [EmailJS](https://www.emailjs.com/) for the contact form
- Google Analytics (gtag)

## Pages

| Route       | Page                          |
| ----------- | ----------------------------- |
| `/`         | Home                          |
| `/epcs`     | Understanding Your EPC        |
| `/retrofit` | Retrofit Surveys              |
| `/about`    | About / company story         |
| `/contact`  | Contact + inquiry form        |

## Local development

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build to /dist
npm run preview  # preview the production build
```

## Deploying to Vercel

This repo is Vercel-ready:

1. Go to [vercel.com/new](https://vercel.com/new) and import the
   `Heskey-EN/EcoFutures` GitHub repository.
2. Vercel auto-detects **Vite** — Build Command `npm run build`, Output `dist`.
   No changes needed.
3. Click **Deploy**.

`vercel.json` includes a SPA rewrite so client-side routes (e.g. `/about`)
resolve correctly on direct load / refresh.

To use your custom domain (`ecofutures.uk`), add it under
**Project → Settings → Domains** and point your DNS at Vercel.

## Contact form configuration

The contact form posts through EmailJS using public client-side keys. To use a
different EmailJS account, set these environment variables (e.g. in Vercel
**Project → Settings → Environment Variables**) — they override the built-in
defaults:

```
VITE_EMAILJS_SERVICE=your_service_id
VITE_EMAILJS_TEMPLATE=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The EmailJS template expects these fields: `name`, `email`, `address`, `message`.

## Analytics

Google Analytics is wired up in `index.html` with measurement ID
`G-QXW4DLMERL`. Replace it with your own ID if needed.
