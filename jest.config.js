module.exports = {
  roots: ["<rootDir>/tests/integration", "<rootDir>/projects", "<rootDir>/src"],
  globals: {
    "ts-jest": {
      tsConfig: "src/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.html?$"
    }
  },
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["./jest.ts"],
  moduleNameMapper: {
    "^@app/(.*)": "<rootDir>/src/app/$1",
    "^@env/(.*)": "<rootDir>/src/environments/$1",
    "^@xlayers/sketch-ingestor":
      "<rootDir>/projects/sketch-ingestor/src/public_api.ts",
    "^@xlayers/sketch-ingestor/(.*)":
      "<rootDir>/projects/sketch-ingestor/src/lib/$1",
    "^@xlayers/sketch-lib": "<rootDir>/projects/sketch-lib/src/public_api.ts",
    "^@xlayers/sketch-lib/(.*)": "<rootDir>/projects/sketch-lib/src/lib/$1",
    "^@xlayers/css-codegen": "<rootDir>/projects/css-codegen/src/public_api.ts",
    "^@xlayers/css-codegen/(.*)": "<rootDir>/projects/css-codegen/src/lib/$1",
    "^@xlayers/svg-codegen": "<rootDir>/projects/svg-codegen/src/public_api.ts",
    "^@xlayers/svg-codegen/(.*)": "<rootDir>/projects/svg-codegen/src/lib/$1",
    "^@xlayers/web-codegen": "<rootDir>/projects/web-codegen/src/public_api.ts",
    "^@xlayers/web-codegen/(.*)": "<rootDir>/projects/web-codegen/src/lib/$1",
    "^@xlayers/xaml-codegen":
      "<rootDir>/projects/xaml-codegen/src/public_api.ts",
    "^@xlayers/xaml-codegen/(.*)": "<rootDir>/projects/xaml-codegen/src/lib/$1",
    "^@xlayers/angular-codegen":
      "<rootDir>/projects/angular-codegen/src/public_api.ts",
    "^@xlayers/angular-codegen/(.*)":
      "<rootDir>/projects/angular-codegen/src/lib/$1",
    "^@xlayers/lit-element-codegen":
      "<rootDir>/projects/lit-element-codegen/src/public_api.ts",
    "^@xlayers/lit-element-codegen/(.*)":
      "<rootDir>/projects/lit-element-codegen/src/lib/$1",
    "^@xlayers/react-codegen":
      "<rootDir>/projects/react-codegen/src/public_api.ts",
    "^@xlayers/react-codegen/(.*)":
      "<rootDir>/projects/react-codegen/src/lib/$1",
    "^@xlayers/stencil-codegen":
      "<rootDir>/projects/stencil-codegen/src/public_api.ts",
    "^@xlayers/stencil-codegen/(.*)":
      "<rootDir>/projects/stencil-codegen/src/lib/$1",
    "^@xlayers/vue-codegen": "<rootDir>/projects/vue-codegen/src/public_api.ts",
    "^@xlayers/vue-codegen/(.*)": "<rootDir>/projects/vue-codegen/src/lib/$1",
    "^@xlayers/web-component-codegen":
      "<rootDir>/projects/web-component-codegen/src/public_api.ts",
    "^@xlayers/web-component-codegen/(.*)":
      "<rootDir>/projects/web-component-codegen/src/lib/$1"
  }
};
