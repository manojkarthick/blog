# Blog

Manoj's personal blog, built with Astro and deployed to Cloudflare Workers.

Live: https://manojkarthick.com

## Development

Requires Node.js 22.12+ and pnpm 10.7.1 (Corepack is recommended).

```bash
corepack enable
pnpm install
pnpm run dev
```

Add posts as Markdown or MDX files in `src/content/posts/`.

## Cloudflare Workers

Build and preview the production Worker locally:

```bash
pnpm preview
```

Deploy:

```bash
pnpm run deploy
```

The Worker custom domains are declared in `wrangler.jsonc`. Deploying them
requires `manojkarthick.com` to be an active zone in the same Cloudflare
account as the Worker.

### Custom domain cutover

1. Add `manojkarthick.com` to Cloudflare and review every imported DNS record.
2. If DNSSEC is enabled at Porkbun, disable it before changing nameservers.
3. At Porkbun, replace the Porkbun nameservers with the two nameservers assigned
   by Cloudflare. Wait for the Cloudflare zone to become active.
4. In Cloudflare DNS, remove the old Netlify records for the apex and `www`
   hostnames. Preserve any unrelated records, especially email records.
5. Run `pnpm run deploy`. Wrangler will attach `manojkarthick.com` and
   `www.manojkarthick.com` to the Worker and provision their certificates.
6. Add a Cloudflare Redirect Rule that permanently redirects `www` to the apex
   hostname while preserving the path and query string.
7. Verify the home page, a post, `/projects/`, `/rss.xml`, `/robots.txt`, and
   `/sitemap-index.xml` on the custom domain.

The `workers.dev` hostname remains enabled as a fallback. Pages served there
advertise `https://manojkarthick.com` as their canonical URL.

To roll back before DNS has fully propagated, restore the previous Porkbun
nameservers. To roll back after Cloudflare is authoritative, restore the old
Netlify DNS records and remove the Worker custom domains.

Useful checks:

```bash
pnpm format:check
pnpm build
```
