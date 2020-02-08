const utils = require("./utils");

async function buildAllLibraries() {
    // ORDER IS NEEDED FOR DEPS
    await utils.cmd('ng', [`build sketch-ingestor`]);
    await utils.cmd('ng', [`build sketch-lib`]);
    await utils.cmd('ng', [`build css-codegen`]);
    await utils.cmd('ng', [`build svg-codegen`]);
    await utils.cmd('ng', [`build xaml-codegen`]);
    await utils.cmd('ng', [`build web-codegen`]);
    await utils.cmd('ng', [`build web-component-codegen`]);
    await utils.cmd('ng', [`build angular-codegen`]);
    await utils.cmd('ng', [`build vue-codegen`]);
    await utils.cmd('ng', [`build stencil-codegen`]);
    await utils.cmd('ng', [`build lit-element-codegen`]);
    await utils.cmd('ng', [`build react-codegen`]);

}

utils.runTask('Building library', () => buildAllLibraries());

