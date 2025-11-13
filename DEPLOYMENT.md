# Deployment checklist

Deze file bevat de concrete stappen en exacte secret-namen die nodig zijn om deze repository automatisch naar Vercel te deployen en Supabase in productie te zetten.

## GitHub Actions -> Vercel

De CI workflow (`.github/workflows/ci.yml`) is bijgewerkt om te deployen naar Vercel met de community action `amondnet/vercel-action@v20`.

Voeg deze GitHub Secrets toe aan de repository (`Settings` → `Secrets` → `Actions`):

- `VERCEL_TOKEN` — persoonlijke Vercel token (read/write deploy permission)
- `VERCEL_ORG_ID` — je Vercel organization id (of team id)
- `VERCEL_PROJECT_ID` — het project id van het Vercel project

Opmerking: de workflow buildt de hele repository en runt `npm run build` (root) before deploy; de action deployed vanuit de `frontend` directory.

## Vercel project setup

1. Maak of connect een Vercel project.
2. Stel de Project Root in op: `frontend` (mono-repo).
3. Voeg environment variables toe in de Vercel project settings (Environment = Production/Staging/Preview as needed):

- `NEXT_PUBLIC_SUPABASE_URL` = https://<project>.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = <anon-key>
- `SUPABASE_SERVICE_ROLE_KEY` = <service-role-key>  (server-only, markeer als secret / server-only)
- `REPLICATE_API_TOKEN` = <replicate-token> (indien gebruikt)
- `OPENAI_API_KEY` = <openai-key> (indien gebruikt)

Belangrijk: variabelen die beginnen met `NEXT_PUBLIC_` zijn client-visible. Zet `SUPABASE_SERVICE_ROLE_KEY` niet als `NEXT_PUBLIC_` — alleen server-side.

## Supabase

1. Maak een Supabase project aan via dashboard.
2. Open `database/schema.sql` en run die in de Supabase SQL Editor, of gebruik de Supabase CLI:

```powershell
cd C:\path\to\repo
supabase login
supabase db push
```

3. Kopieer de Project URL en keys:
- `anon/public key` -> gebruik in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` -> bewaar als `SUPABASE_SERVICE_ROLE_KEY` (server-only)

4. Pas in Supabase dashboard `Settings` → `Site URL` / `Redirect URLs` aan naar je Vercel-hostname (bijv. `https://my-app.vercel.app`).

## GitHub Secrets (samenvatting)

- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (only for backend)
- REPLICATE_API_TOKEN (optional)
- OPENAI_API_KEY (optional)

## Local dev

Maak `.env.local` in `frontend` met:

```powershell
Set-Content -Path frontend\.env.local -Value "NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co`nNEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>"
```

Start dev server:

```powershell
cd frontend
npm install
npm run dev
```

## Wanneer iets misgaat

- Vercel build errors: check Vercel deployment logs and ensure `frontend` is the project root and env-vars are present.
- Supabase connection errors: controleer keys (geen extra spaties) en dat de project URL correct is.

---
Als je wilt kan ik nu:

1. een PR openen met de workflowwijziging (ik heb de workflow al gecommit in deze branch),
2. proberen de build + lint lokaal in de CI-run te simuleren en eventuele errors te fixen, of
3. direct vragen aan jou om de genoemde GitHub secrets toe te voegen zodat de deploy stap automatisch zal slagen.

Geef aan welke van de drie je wil dat ik nu doe.
