module.exports = {
  roots: ["<rootDir>/tests/integration", "<rootDir>/projects", "<rootDir>/src"],
  globals: {
    "ts-jest": {
      tsConfig: "src/tsconfig.spec.json"
    },
    __TRANSFORM_HTML__: true
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
    "^@xlayers/web-codegen/(.*)": "<rootDir>/projects/web-codegen/src/lib/$1"
  }
};
