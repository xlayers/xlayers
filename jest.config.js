module.exports = {
  roots: [
    "<rootDir>/packages"
  ],
  globals: {
    "ts-jest": {
      tsConfig: "packages/core/src/tsconfig.spec.json"
    },
    __TRANSFORM_HTML__: true
  },
  preset: "jest-preset-angular",
  setupTestFrameworkScriptFile: "./jest.ts",
  moduleNameMapper: {
    "~(.*)": "<rootDir>/packages/$1",
    "^\@xlayers/(.*)": "<rootDir>/dist/$1"
  }
}
