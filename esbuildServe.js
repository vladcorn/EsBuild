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
    .then(() => {
      if (!isWatch) {
        log('Build success :)');
        process.exit(0);
      }
    })
    .catch((e) => error(e));

  if (isWatch) {
    serve.start(serveOptions);
    const watcher = watch(['src/*.html', 'src/scss/*.scss']);
    watcher.on('change', () => {
      esbuild
        .build({
          ...options,
        })
        .then(() => {
          serve.update();
          log('✓ Updated');
        })
        .catch((e) => error(e));
    });
  }
};
export default esbuildServe;
