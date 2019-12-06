import { cmd, runTask, packages } from './utils';

export async function buildAllLibrarys() {
    // ORDER IS NEEDED FOR DEPS
    await cmd('ng', [`build sketch-ingestor`]);
    await cmd('ng', [`build sketch-lib`]);
    await cmd('ng', [`build css-codegen`]);
    await cmd('ng', [`build svg-codegen`]);
    await cmd('ng', [`build xaml-codegen`]);
    await cmd('ng', [`build web-codegen`]);
    await cmd('ng', [`build web-component-codegen`]);
    await cmd('ng', [`build angular-codegen`]);
    await cmd('ng', [`build vue-codegen`]);
    await cmd('ng', [`build stencil-codegen`]);
    await cmd('ng', [`build lit-element-codegen`]);
    await cmd('ng', [`build react-codegen`]);

}

runTask('Building library', async () => await buildAllLibrarys());

