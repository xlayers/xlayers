import { cmd, runTask, packages } from './utils';

export async function publishLibrarys() {
    
    await packages.forEach(async (pkg) =>
        await cmd(`npm publish dist/${pkg}`, [`--dry-run`]))
}

runTask('Publishing librarys', () => publishLibrarys());

