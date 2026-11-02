# Consistly website

The coming-soon website for **Consistly**, an upcoming habit tracker and personal growth companion for iPhone. Build habits. Watch yourself grow.

It is a single static page with no backend, database, or tracking. Everything it shows is a concept: the screens are built in HTML and CSS, and the numbers are generated sample data.

## Stack

- [Astro](https://astro.build) for components and static output
- Plain CSS with shared tokens in `src/styles/global.css`
- A little TypeScript for the interactive demos
- Inter, self-hosted as a fallback for the system font on non-Apple devices

## Development

Requires Node 22.23.4 or newer (`.nvmrc` pins 24).

```sh
npm ci
npm run dev      # http://localhost:4321
npm run lint     # Prettier check and astro check
npm run format   # Apply Prettier
npm run build    # Output to dist/
npm run preview  # Serve the production build
```

## Structure

```text
src/
  pages/index.astro       Page, in section order
  layouts/Base.astro      HTML shell and scroll reveal
  components/
    sections/             One file per page section
    screens/              iPhone screen mockups
    IPhone.astro          Device frame
    Widget.astro          iOS widget mockups
    Heat.astro            Static contribution graph
    Mascot.astro          Temporary mascot artwork
  lib/sample.ts           Sample data behind every graph and chart
  styles/global.css       Design tokens and base styles
```

## Replacing the mascot

The mascot is temporary artwork. Every appearance goes through `src/components/Mascot.astro`, so final art only needs to change in that file. Keep the `stage`, `label`, `scarf`, and `dressable` props. The customization demo toggles the `.acc-scarf`, `.acc-glasses`, and `.acc-hat` layers, so it needs matching layers or a change in `sections/Rewards.astro`.

## CI and deployment

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`: it installs dependencies, runs lint and type checks, and builds the site. A failure in any step fails the workflow.

Deployment to GitHub Pages is included but **turned off**. GitHub does not offer Pages for private repositories on the Free plan, and this repository is private. To turn it on:

1. Make the repository public, or upgrade the organization's plan.
2. In **Settings > Pages**, set **Source** to **GitHub Actions**.
3. In **Settings > Secrets and variables > Actions > Variables**, add `DEPLOY_PAGES` with the value `true`.
4. Re-run the workflow or push to `main`.

To use the custom domain, set `www.consistly.info` under **Settings > Pages > Custom domain** and point DNS at GitHub. The workflow picks up the new base path by itself.

The output is plain static files, so any static host also works. Use `npm run build` as the build command and `dist` as the output directory.

| Variable    | Default                      | Purpose                              |
| ----------- | ---------------------------- | ------------------------------------ |
| `BASE_PATH` | `/`                          | Path the site is served from         |
| `SITE_URL`  | `https://www.consistly.info` | Site origin used by the Astro config |
