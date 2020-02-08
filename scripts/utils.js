const cp = require('child_process');
const path = require('path');

// script ideas from NGRX repo

const ora = require('ora');
async function runTask(name, taskFn) {
    const spinner = ora(name);

    try {
        spinner.start();

        await taskFn();

        spinner.succeed();
    } catch (e) {
        spinner.stop();

        throw e;
    }
}

// export type BaseFn = (command: string) => string;

function baseDir(...dirs) {
    return `"${path.resolve(__dirname, '../', ...dirs)}"`;
}
function fromNpm(command) {
    return baseDir(`./node_modules/.bin/${command}`);
}

function exec(
    command,
    args,
    base = fromNpm
) {
    return new Promise((resolve, reject) => {

        const child = cp.exec(base(command) + ' ' + args.join(' '), (err, stdout) => {
            if (err) {
                return reject(err);
            }

            resolve(stdout.toString());
        });
        child.stdout.on('data', function (data) {
            console.log(data.toString());
        });
    });
}

function cmd(command, args) {
    return exec(command, args, (runCommand) => runCommand);
}


module.exports = {
  runTask, cmd
}
