import esbuildServe from 'esbuild-serve';
import { sassPlugin } from 'esbuild-sass-plugin';
import alias from 'esbuild-plugin-alias';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';

esbuildServe(
    {
        entryPoints: ['src/js/app.js'],
        bundle: true,
        minify: true,
        outfile: 'src/dist/index.js',
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
