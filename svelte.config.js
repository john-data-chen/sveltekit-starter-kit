import adapter from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
    runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true)
  },
  kit: {
    // Targets Vercel. The default Node.js serverless runtime is required because the app
    // talks to PostgreSQL over TCP via `postgres` (the edge runtime can't). See
    // https://svelte.dev/docs/kit/adapter-vercel for runtime/region options.
    adapter: adapter(),

    typescript: {
      config: (config) => ({
        ...config,
        include: [...config.include, "../drizzle.config.ts"]
      })
    }
  }
};

export default config;
