import assert from 'assert';
import path from 'upath';
import { setupBuildParserProgram } from '../src/commands/build.parser';
import {
  collectVivliostyleConfig,
  mergeConfig,
  MergedConfig,
} from '../src/config';

export const getMergedConfig = async (
  args: string[],
): Promise<MergedConfig | MergedConfig[]> => {
  const program = setupBuildParserProgram().parse([
    'vivliostyle',
    'build',
    ...args,
  ]);
  const options = program.opts();
  const { vivliostyleConfig, vivliostyleConfigPath, cliFlags } =
    collectVivliostyleConfig({
      ...program.opts(),
      input: program.args?.[0],
      configPath: options.config,
      targets: options.targets,
    });
  const context = vivliostyleConfig
    ? path.dirname(vivliostyleConfigPath)
    : __dirname;
  const config = await Promise.all(
    (vivliostyleConfig ?? [vivliostyleConfig]).map((entry) =>
      mergeConfig(cliFlags, entry, context),
    ),
  );
  return config.length > 1 ? config : config[0];
};

const rootPath = path.resolve(__dirname, '..');
export const maskConfig = (obj: any) => {
  Object.entries(obj).forEach(([k, v]) => {
    if (v && typeof v === 'object') {
      maskConfig(v);
    } else if (k === 'executableChromium') {
      obj[k] = '__EXECUTABLE_CHROMIUM_PATH__';
    } else if (k === 'image') {
      obj[k] = '__IMAGE__';
    } else if (typeof v === 'string') {
      obj[k] = v.replace(rootPath, '__WORKSPACE__');
    }
  });
};

export const resolveFixture = (p: string) =>
  path.resolve(__dirname, 'fixtures', p);

export function assertSingleItem<T = unknown>(
  value: T | T[],
): asserts value is T {
  return assert(!Array.isArray(value));
}
