import { defineConfig } from 'vite';
import { resolve } from 'path';
import fg from 'fast-glob';

// Auto-discover JS and CSS from top-level folders like pages/, utils/, etc.
const jsFiles = fg.sync('pages/**/*.js').concat(fg.sync('utils/**/*.js'));
const cssFiles = fg.sync('*.css'); // e.g., main.css

const input = {};

// Add JS files
jsFiles.forEach((file) => {
  const name = file.replace(/\.js$/, '');
  input[name] = resolve(__dirname, file);
});

// Add CSS files (only if not already defined)
cssFiles.forEach((file) => {
  const name = file.replace(/\.css$/, '');
  if (!input[name]) {
    input[name] = resolve(__dirname, file);
  }
});

console.log('Vite build input:', Object.keys(input));

export default defineConfig({
  build: {
    rollupOptions: {
      input,
      output: {
        entryFileNames: '[name].min.js',
        assetFileNames: (assetInfo) => {
          const path = assetInfo.name.replace(/\.(css|js)$/, '');
          return `${path}.min.[ext]`;
        },
      },
    },
    outDir: 'dist',
    minify: 'esbuild',
  },
});