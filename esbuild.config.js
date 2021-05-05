import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import esbuildServe from './esbuildServe.js';

esbuildServe(
  {
    entryPoints: ['src/js/app.js'],
    bundle: true,
    minify: true,
    outfile: 'src/dist/index.js',
    loader: { '.svg': 'dataurl', '.png': 'dataurl', '.jpeg': 'dataurl', '.jpg': 'dataurl' },
    platform: 'browser',
    target: 'esnext',
    sourcemap: true,
    logLevel: 'error',
    incremental: true,
    plugins: [
      sassPlugin({
        type: [['css', 'src/scss/**']],
        async transform(source, resolveDir) {
          const { css } = await postcss([
            autoprefixer,
            postcssPresetEnv({
              stage: 0,
              browsers: 'last 2 versions',
            }),
          ]).process(source);
          return css;
        },
      }),
    ],
  },
  {
    port: 4000,
    root: './src',
  }
);
