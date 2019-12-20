import { cmd, runTask, packages } from './utils';

export async function publishLibrary() {
    const pkg = process.argv[2];
    if (!pkg) {
        throw new Error('There is no package specified');
    } else if (!packages.includes(pkg)) {
        throw new Error('There is no package from our list');

    }
    await process.chdir(`./projects/${pkg}`);
    await cmd('npx', [`release-it --ci`]);
}

runTask('Publish library', async () => await publishLibrary());

