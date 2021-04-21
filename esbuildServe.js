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
    .catch(() => process.exit(1));

  if (isWatch) {
    serve.start(serveOptions);
    const watcher = watch(['src/*.html', 'src/scss/*.scss']);
    watcher.on('change', () => {
      console.log('FROM WhatHCER');
      esbuild
        .build({
          ...options,
        })
        .then(() => {
          serve.update();
          log('✓ Updated');
        })
        .catch(() => process.exit(1));
    });
  }
};
export default esbuildServe;
