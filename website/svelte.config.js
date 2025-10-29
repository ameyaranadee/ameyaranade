import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [preprocess({ postcss: true })],

	kit: {
		adapter: adapter()
	}
};
