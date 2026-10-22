# Operion Documentation

Official documentation site for [Operion](https://github.com/operion-flow/operion), event-driven workflows for many tenants in one binary on PostgreSQL. Built with [Fumadocs](https://fumadocs.dev) and Next.js.

The docs follow operion's `main`: a change to operion that users can see ships with a pull request here.

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Features

- **Landing Page**: Modern homepage showcasing Operion's key features
- **Comprehensive Documentation**: Complete guides for developers and operators
- **Organized Content**: Structured documentation with proper MDX formatting
- **Interactive Search**: Full-text search across all documentation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Documentation Structure

| Section | Description |
| ------- | ----------- |
| **Getting Started** | Run the image with Compose, publish a first workflow, run a workflow file locally |
| **Concepts** | Workflows, executions, templates and tenants |
| **Triggers** | Webhook, scheduler, catalog events and Kafka topics |
| **Nodes** | Built-in nodes and remote nodes over HTTP |
| **Operating** | Deployment, configuration and troubleshooting |
| **Reference** | HTTP API and CLI |

## Project Structure

| Path | Description |
| ---- | ----------- |
| `app/(home)/` | Landing page and marketing content |
| `app/docs/` | Documentation layout and pages |
| `content/docs/` | MDX documentation content |
| `lib/source.ts` | Content source adapter for Fumadocs |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Deployment

`npm run build` exports a static site to `out/` (`output: 'export'`); search uses an index built at the same time, so nothing runs on a server. Cloudflare Workers serves `out/` as static assets, as `wrangler.jsonc` declares, and serves `out/404.html` for unknown paths.

The Cloudflare project is connected to this repository with Workers Builds: build command `npm run build`, deploy command `npx wrangler deploy`. A push to `main` deploys the site, and other branches get preview URLs.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs
