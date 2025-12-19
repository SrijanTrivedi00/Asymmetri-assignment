**Project**: This is a Next.js (App Router) + TypeScript web app scaffolded from create-next-app.

**Overview**
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / PostCSS
- **Auth / Database:** Supabase (server + client)
- **Auth Providers:** NextAuth with optional GitHub / Google providers
- **APIs:** Server routes under `app/api/*`
- **Other services:** Perplexity (used via `PERPLEXITY_API_KEY`)

**How to run (local)**

- Install dependencies:

```bash
npm install
```

- Run development server:

```bash
npm run dev
# Visit http://localhost:3000
```

- Build for production:

```bash
npm run build
npm start
```

- Lint:

```bash
npm run lint
```

Files to know:
- `app/` — Next.js app routes and UI components
- `app/api/` — server API routes (e.g., assistant, auth)
- `lib/supabaseServer.ts` — Supabase server client
- `lib/auth.ts` — NextAuth provider configuration

.env Contents:

NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ALPHA_VANTAGE_API_KEY=
PERPLEXITY_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
