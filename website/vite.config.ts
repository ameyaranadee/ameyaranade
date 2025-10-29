import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import pluginYaml from '@rollup/plugin-yaml';
import yaml from 'js-yaml';
import { dataToEsm } from '@rollup/pluginutils';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

function markdown() {
	return {
		name: 'markdown',

		transform(src: string, id: string) {
			if (/\.md$/.test(id)) {
				let frontmatter = {};
				let content = src;
				if (src.startsWith('---')) {
					const end = src.indexOf('---', 3);
					if (end === -1) {
						throw new Error(`Unclosed YAML frontmatter in ${id}`);
					}
					frontmatter = yaml.load(src.substring(3, end).trim()) as any;
					content = src.substring(end + 3).trim();
				}
				return {
					code: dataToEsm({ ...frontmatter, content }),
					map: null
				};
			}
		}
	};
}

export default defineConfig({
	plugins: [sveltekit(), pluginYaml(), markdown()],
	css: {
		postcss: {
			plugins: [tailwindcss(), autoprefixer()]
		}
	}
});
