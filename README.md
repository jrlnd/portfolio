# Portfolio v2

Astro + React + TypeScript + Tailwind v4. The homepage is an AI chat that answers questions about JR; the classic project portfolio lives at `/classic`.

## Develop

```sh
npm install
cp .env.example .env       # then add your real GEMINI_API_KEY
npm run dev
```

Open <http://localhost:4321>.

### Get a Gemini API key

1. Go to <https://aistudio.google.com/apikey> and sign in.
2. Click **Create API key**, copy it into `.env` as `GEMINI_API_KEY`.
3. Free tier covers portfolio-scale traffic. Set spend limits in the cloud console if you want a hard cap.

## Edit what the assistant knows about you

Open [`src/content/profile.ts`](src/content/profile.ts). Replace the `TODO:` fields with real values — anything left as `TODO:` is stripped before the prompt is sent, so the assistant will say it doesn't know rather than make something up.

## Add a project

Create `src/content/projects/<slug>.mdx` with frontmatter that matches the schema in `src/content.config.ts`. Cover images live in `src/assets/projects/` and are referenced relatively. Projects show on `/classic` and are also sent to the chat assistant as context.

## Build

```sh
npm run build      # type-checks then builds
npm run preview    # serve the production build locally
```

## Deploy

Configured for [Vercel](https://vercel.com). Connect the repo, set `GEMINI_API_KEY` in the project's environment variables, and deploy. The chat route runs as a serverless function; everything else is prerendered.
