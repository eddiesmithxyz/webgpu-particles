import esbuild from 'esbuild';
import { createBuildSettings } from './settings.js';

import { copyFiles } from './copy.js'
copyFiles()

const settings = createBuildSettings({ 
  sourcemap: true,
  banner: {
    js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
  }
});

const ctx = await esbuild.context(settings);

await ctx.watch();

const { host, port } = await ctx.serve({
  port: 8000,
  servedir: 'dist'
});

console.log(`Serving app at ${host}:${port}.`);