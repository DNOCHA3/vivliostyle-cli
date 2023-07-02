import chalk from 'chalk';
import terminalLink from 'terminal-link';
import path from 'upath';
import { getExecutableBrowserPath } from './browser.js';
import {
  checkOverwriteViolation,
  cleanupWorkspace,
  compile,
  copyAssets,
  prepareThemeDirectory,
} from './builder.js';
import {
  CliFlags,
  MergedConfig,
  collectVivliostyleConfig,
  mergeConfig,
} from './config.js';
import { exportEpub } from './epub-output.js';
import { buildPDF, buildPDFWithContainer } from './pdf.js';
import { teardownServer } from './server.js';
import {
  checkContainerEnvironment,
  cwd,
  debug,
  log,
  startLogging,
  stopLogging,
} from './util.js';
import { exportWebPublication } from './webbook.js';

export interface BuildCliFlags extends CliFlags {
  output?: {
    output?: string;
    format?: string;
  }[];
  bypassedPdfBuilderOption?: string;
}

export async function getFullConfig(
  cliFlags: BuildCliFlags,
): Promise<MergedConfig[]> {
  const loadedConf = await collectVivliostyleConfig(cliFlags);
  const { vivliostyleConfig, vivliostyleConfigPath } = loadedConf;
  const loadedCliFlags = loadedConf.cliFlags;

  const context = vivliostyleConfig ? path.dirname(vivliostyleConfigPath) : cwd;

  const configEntries: MergedConfig[] = [];
  for (const entry of vivliostyleConfig ?? [vivliostyleConfig]) {
    const config = await mergeConfig(loadedCliFlags, entry, context);
    checkUnsupportedOutputs(config);

    // check output path not to overwrite source files
    for (const target of config.outputs) {
      checkOverwriteViolation(config, target.path, target.format);
    }
    configEntries.push(config);
  }
  return configEntries;
}

export async function build(cliFlags: BuildCliFlags) {
  if (cliFlags.bypassedPdfBuilderOption) {
    const option = JSON.parse(cliFlags.bypassedPdfBuilderOption);
    // Host doesn't know browser path inside of container
    option.executableBrowser = getExecutableBrowserPath(
      option.browserType ?? 'chromium',
    );
    debug('bypassedPdfBuilderOption', option);

    startLogging();
    await buildPDF(option);
    // Stop remaining stream output and kill process
    stopLogging();

    teardownServer();
    return;
  }

  const isInContainer = checkContainerEnvironment();
  startLogging('Collecting build config');
  const configEntries = await getFullConfig(cliFlags);

  for (const config of configEntries) {
    // build artifacts
    if (config.manifestPath) {
      await cleanupWorkspace(config);
      await prepareThemeDirectory(config);
      await compile(config);
      await copyAssets(config);
    }

    // generate files
    for (const target of config.outputs) {
      let output: string | null = null;
      if (target.format === 'pdf') {
        if (!isInContainer && target.renderMode === 'docker') {
          output = await buildPDFWithContainer({
            ...config,
            input: (config.manifestPath ??
              config.webbookEntryPath ??
              config.epubOpfPath) as string,
            target,
          });
        } else {
          output = await buildPDF({
            ...config,
            input: (config.manifestPath ??
              config.webbookEntryPath ??
              config.epubOpfPath) as string,
            target,
          });
        }
      } else if (target.format === 'webpub') {
        const { exportAliases, outputs, manifestPath } = config;
        if (!manifestPath) {
          continue;
        }
        output = await exportWebPublication({
          exportAliases,
          outputs,
          manifestPath,
          input: config.workspaceDir,
          outputDir: target.path,
        });
      } else if (target.format === 'epub') {
        const { exportAliases, outputs, manifestPath } = config;
        if (!manifestPath) {
          continue;
        }
        await exportEpub({
          exportAliases,
          outputs,
          input: config.workspaceDir,
          manifestPath,
          target: target.path,
          epubVersion: target.version,
        });
      }
      if (output) {
        const formattedOutput = chalk.bold.green(path.relative(cwd, output));
        log(
          `\n${terminalLink(formattedOutput, 'file://' + output, {
            fallback: () => formattedOutput,
          })} has been created.`,
        );
      }
    }

    teardownServer();
  }

  stopLogging('Built successfully.', '🎉');
}

function checkUnsupportedOutputs({
  webbookEntryPath,
  epubOpfPath,
  outputs,
}: MergedConfig) {
  if (webbookEntryPath && outputs.some((t) => t.format === 'webpub')) {
    throw new Error(
      'Exporting webpub format from single HTML input is not supported.',
    );
  } else if (epubOpfPath && outputs.some((t) => t.format === 'webpub')) {
    throw new Error(
      'Exporting webpub format from EPUB or OPF file is not supported.',
    );
  }
}
