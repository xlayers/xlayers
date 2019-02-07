const base = require("../../jest.config.base.js");
const pack = require("./package");

module.exports = {
  ...base,
  displayName: pack.name,
  name: pack.name,
  rootDir: "../..",
  testMatch: [`<rootDir>/packages/${pack.name}/**/*.spec.js`],
};
