import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: process.env.NODE_ENV === 'development' ? false : true,
		},
		alias: {
			"@db-drizzle": "./drizzle",
			"@db-drizzle/*": "./drizzle/*",
			"$ui": "./src/lib/components/ui",
		}
	},
};

export default config;
