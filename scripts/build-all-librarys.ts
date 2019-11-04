import { cmd, runTask } from './utils';

export async function buildAllLibrarys() {
    // ORDER IS NEEDED FOR DEPS
    await cmd('ng', [`build sketch-ingestor`]);
    await cmd('ng', [`build sketch-lib`]);
    await cmd('ng', [`build css-codegen`]);
    await cmd('ng', [`build svg-codegen`]);
    await cmd('ng', [`build web-codegen`]);
    await cmd('ng', [`build xaml-codegen`]);


}

runTask('Building library', () => buildAllLibrarys());

