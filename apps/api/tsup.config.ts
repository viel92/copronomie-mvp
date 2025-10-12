import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2022',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: true,
  skipNodeModulesBundle: true,
  external: [
    '@hono/node-server',
    '@hono/swagger-ui',
    '@hono/trpc-server',
    '@hono/zod-openapi',
    '@hono/zod-validator',
    '@supabase/supabase-js',
    '@trpc/client',
    '@trpc/server',
    'hono',
    'dotenv',
    'pg',
    'resend',
    'ws',
    'zod'
  ]
})
