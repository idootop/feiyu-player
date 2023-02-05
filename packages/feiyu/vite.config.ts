import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import vitePluginImp from 'vite-plugin-imp';
import { VitePWA } from 'vite-plugin-pwa';

const title = '🐟飞鱼';
const description = '一个漂亮得不像实力派的视频播放器✨';

export default defineConfig({
  plugins: [
    react(),
    // 分包加载
    splitVendorChunkPlugin(),
    // @arco-design 组件样式按需加载
    vitePluginImp({
      libList: [
        {
          libName: '@arco-design/web-react',
          camel2DashComponentName: false,
          style: (name) => {
            return [
              '@arco-design/web-react/lib/style/index.less',
              `@arco-design/web-react/lib/${name}/style/index.less`,
            ];
          },
        },
      ],
    }),
    // html 压缩 + 元数据替换
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title,
          description,
        },
      },
    }),
    // PWA
    VitePWA({
      outDir: 'dist/pwa',
      registerType: 'prompt',
      workbox: {
        globPatterns: ['../**/*.{js,css,html,jpg,png,svg,gif}'],
        globIgnores: ['**/node_modules/**/*', 'pwa/sw.js', 'pwa/workbox-*.js'],
      },
      manifest: {
        lang: 'zh-CN',
        name: title,
        short_name: title,
        description: description,
        theme_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  envPrefix: 'k',
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src/') }],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    open: false,
  },
  build: {
    minify: true,
    chunkSizeWarningLimit: 1024, // 1MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const lib = id.split('node_modules/')[1].split('/')[0];
            if (
              [
                '@arco-design',
                'localforage',
                'lodash',
                'dayjs',
              ].includes(lib)
            ) {
              return lib;
            }
          }
        },
      },
    },
  },
});
