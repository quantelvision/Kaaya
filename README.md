# Kaaya

Kaaya, a demo fashion storefront by Quantel Vision.

The store runs on Next.js with content from Sanity. The embedded Sanity Studio is at `/studio`. Checkout, payments and orders are simulated in the browser session. No real orders are placed.

## Requirements

- Node.js 20.9 or later (developed on Node.js 24)
- pnpm 11
- A Sanity project with a dataset and a write token

## Setup

```
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`, then start the dev server:

```
pnpm dev
```

The store runs at `http://localhost:3000`.

## Environment variables

| Name                             | Purpose                                                 |
| -------------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Public site URL, `http://localhost:3000` in development |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Sanity project id                                       |
| `NEXT_PUBLIC_SANITY_DATASET`     | Sanity dataset, usually `production`                    |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date, for example `2026-10-01`       |
| `SANITY_API_WRITE_TOKEN`         | Write token, used only by the seed script               |
| `SANITY_REVALIDATE_SECRET`       | Secret for the Sanity webhook signature                 |
| `LEAD_SLACK_WEBHOOK_URL`         | Optional. Slack incoming webhook for enquiries          |
| `RESEND_API_KEY`                 | Optional. Resend API key for enquiry emails             |
| `LEAD_EMAIL_TO`                  | Recipient address for enquiry emails                    |
| `LEAD_EMAIL_FROM`                | Verified sender address for enquiry emails              |

Enquiries go to every destination that is configured.

## Scripts

| Script              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `pnpm dev`          | Start the dev server                                                |
| `pnpm build`        | Production build                                                    |
| `pnpm start`        | Serve the production build                                          |
| `pnpm lint`         | Run ESLint                                                          |
| `pnpm typecheck`    | Generate route types and run the TypeScript compiler                |
| `pnpm test`         | Run unit tests with Vitest                                          |
| `pnpm format`       | Format the code with Prettier                                       |
| `pnpm seed`         | Upload images and content to Sanity. Safe to run again              |
| `pnpm brand:assets` | Generate the favicon, app icons, Open Graph image and splash images |
