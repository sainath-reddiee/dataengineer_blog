import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    })
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Build optimizations for production
  build: {
    // Target modern browsers for better performance
    target: ['es2015', 'chrome64', 'firefox67', 'safari12'],
    
    // Optimize chunks
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          // Vendor chunk for libraries
          vendor: [
            'react',
            'react-dom',
            'react-router-dom'
          ],
          // UI components chunk
          ui: [
            'framer-motion',
            'lucide-react'
          ],
          // Utils chunk
          utils: [
            '@/services/wordpressApi',
            '@/hooks/useWordPress'
          ]
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '') 
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        // Optimize asset names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    
    // Minification and optimization
    minify: 'esbuild', // Faster than terser
    sourcemap: false, // Disable sourcemaps for production
    
    // Reduce bundle size
    chunkSizeWarningLimit: 1000, // Warn for chunks > 1MB
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    
    // Remove console logs and debugger statements in production
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },

  // Development server optimizations
  server: {
    // Enable HTTP/2 for development
    https: false,
    
    // Hot Module Replacement optimizations
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
    
    // Faster development builds
    fs: {
      // Allow serving files from one level up from package root
      allow: ['..']
    }
  },

  // Optimizations for dependencies
  optimizeDeps: {
    // Pre-bundle these dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'react-helmet-async'
    ],
    
    // Exclude these from pre-bundling
    exclude: [
      // Large dependencies that should be lazy loaded
    ],
    
    // ESBuild options for dependency optimization
    esbuildOptions: {
      target: 'es2015',
      supported: {
        'top-level-await': true
      }
    }
  },

  // CSS optimizations
  css: {
    // PostCSS optimizations
    postcss: {
      plugins: [
        // Add autoprefixer for better browser support
        require('autoprefixer')({
          overrideBrowserslist: [
            'last 2 versions',
            '> 1%',
            'not dead',
            'not ie 11'
          ]
        }),
        // Optimize CSS for production
        ...(process.env.NODE_ENV === 'production' ? [
          require('cssnano')({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              minifyFontValues: true,
              minifySelectors: true
            }]
          })
        ] : [])
      ]
    },
    
    // Enable CSS modules for better performance
    modules: {
      localsConvention: 'camelCase'
    },
    
    // Preprocessor options
    preprocessorOptions: {
      scss: {
        // Add global SCSS variables if needed
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  // Preview server optimizations
  preview: {
    port: 4173,
    strictPort: true,
    
    // Enable compression
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },

  // Environment variables
  define: {
    // Define global constants
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
  },

  // Plugin configurations
  esbuild: {
    // JSX optimizations
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    
    // Target modern browsers
    target: 'es2015',
    
    // Optimize for size in production
    ...(process.env.NODE_ENV === 'production' && {
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    })
  },

  // Worker optimizations
  worker: {
    format: 'es',
    plugins: [
      // Add plugins specific to workers if needed
    ]
  },

  // Experimental features
  experimental: {
    // Enable render built-in support if available
    renderBuiltUrl: (filename, { hostType }) => {
      // Optimize URLs for different host types
      if (hostType === 'js') {
        return `/${filename}`;
      } else {
        return `/${filename}`;
      }
    }
  }
});