import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

export default function createConfig(importMetaUrl) {
	const dir = path.dirname(fileURLToPath(importMetaUrl));
	return defineConfig({
		plugins: [react({ include: /\.(jsx|js)$/ })],
		root: dir,
		resolve: {
			alias: {
				'@bucky24/react-canvas': path.resolve(dir, '../../src/index.js'),
				'react-canvas': path.resolve(dir, '../../src/index.js'),
			},
		},
		esbuild: {
			include: /\.js$/,
			exclude: /node_modules/,
			loader: 'jsx',
		},
		optimizeDeps: {
			esbuildOptions: {
				loader: { '.js': 'jsx' },
			},
		},
	});
}
