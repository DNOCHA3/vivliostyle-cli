import fs from 'fs';
import path from 'path';

import {
  getBrokerUrl,
  launchSourceAndBrokerServer,
  launchChrome,
  LoadMode,
} from './misc';

interface PreviewOption {
  input: string;
  rootDir: string;
  loadMode: LoadMode;
  sandbox: boolean;
}

export function run({
  input,
  rootDir,
  loadMode = 'document',
  sandbox = true,
}: PreviewOption) {
  const stat = fs.statSync(input);
  const root = rootDir || (stat.isDirectory() ? input : path.dirname(input));
  const indexFile = stat.isDirectory()
    ? path.resolve(input, 'index.html')
    : input;
  const sourceIndex = path.relative(root, indexFile);

  launchSourceAndBrokerServer(root)
    .then(([source, broker]) => {
      const sourcePort = source.port;
      const brokerPort = broker.port;
      const url = getBrokerUrl({
        sourcePort,
        sourceIndex,
        brokerPort,
        loadMode,
      });

      console.log(`Opening preview page... ${url}`);
      launchChrome({
        startingUrl: url,
        chromeFlags: sandbox ? [] : ['--no-sandbox'],
      }).catch((err) => {
        if (err.code === 'ECONNREFUSED') {
          console.log(
            `Cannot launch Chrome. use --no-sandbox option or open ${url} directly.`,
          );
          // Should still run
        } else {
          console.log(
            'Cannot launch Chrome. Did you install it?\nvivliostyle-savepdf supports Chrome (Canary) only.',
          );
          process.exit(1);
        }
      });
    })
    .catch((err: Error) => {
      console.trace(err);
      process.exit(1);
    });
}
