import * as cp from 'child_process';
import * as path from 'path';

// script ideas from NGRX repo

const ora = require('ora');
export async function runTask(name: string, taskFn: () => Promise<any>) {
  const spinner = ora(name);

  try {
    // spinner.start();

    await taskFn();

    // spinner.succeed();
  } catch (e) {
    // spinner.stop();

    throw e;
  }
}

export type BaseFn = (command: string) => string;

export function baseDir(...dirs: string[]): string {
  return `"${path.resolve(__dirname, '../', ...dirs)}"`;
}
export function fromNpm(command: string) {
  return baseDir(`./node_modules/.bin/${command}`);
}

export function exec(
  command: string,
  args: string[],
  base: BaseFn = fromNpm
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = cp.exec(
      base(command) + ' ' + args.join(' '),
      (err, stdout) => {
        if (err) {
          return reject(err);
        }

        resolve(stdout.toString());
      }
    );
    child.stdout.on('data', function(data) {
      console.log(data.toString());
    });
  });
}

export async function cmd(command: string, args: string[]) {
  await exec(command, args, (runCommand: string) => runCommand);
}

export async function git(args: string[]) {
  return  await exec('git', args, (runCommand: string) => runCommand);
}
// ORDER IS NEEDED FOR DEPS
export const packages = [
  'sketch-ingestor',
  'sketch-lib',
  'css-codegen',
  'svg-codegen',
  'xaml-codegen',
  'web-codegen',
  'web-component-codegen',
  'angular-codegen',
  'vue-codegen',
  'stencil-codegen',
  'lit-element-codegen',
  'react-codegen'
];
