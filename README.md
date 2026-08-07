# Blog

Manoj's personal blog, built with Astro and deployed to Cloudflare Workers.

Live: https://blog.merci.workers.dev

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
pnpm deploy
```

Useful checks:

```bash
pnpm format:check
pnpm build
```
