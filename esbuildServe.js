import esbuild from 'esbuild';
import serve, { error, log } from 'create-serve';
import { watch } from 'chokidar';

export const isWatch = process.argv.includes('-w');

const esbuildServe = async (options = {}, serveOptions = {}) => {
    esbuild
        .build({
            ...options,
            watch: isWatch && {
                onRebuild(err) {
                    serve.update();
                    err ? error('× Failed') : log('✓ Updated');
                },
            },
        })
        .catch(() => process.exit(1));

    if (isWatch) {
        serve.start(serveOptions);
        const watcher = watch('src/*.html');
        watcher.on('change', () => {
            serve.update();
            log('✓ Updated');
        });
    }
};
export default esbuildServe;
