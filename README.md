# Portfolio v2

Astro + React + TypeScript + Tailwind v4. Content via MDX content collections.

## Develop

```sh
npm install
npm run dev
```

Open <http://localhost:4321>.

## Add a project

Create `src/content/projects/<slug>.mdx` with frontmatter that matches the schema in `src/content.config.ts`. Cover images live in `src/assets/projects/` and are referenced relatively.

## Build

```sh
npm run build      # type-checks then builds to dist/
npm run preview    # serve the production build locally
```
