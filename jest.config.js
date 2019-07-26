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
    "^@xlayers/css-blocgen": "<rootDir>/projects/css-blocgen/src/public_api.ts",
    "^@xlayers/css-blocgen/(.*)": "<rootDir>/projects/css-blocgen/src/lib/$1",
    "^@xlayers/svg-blocgen": "<rootDir>/projects/svg-blocgen/src/public_api.ts",
    "^@xlayers/svg-blocgen/(.*)": "<rootDir>/projects/svg-blocgen/src/lib/$1",
    "^@xlayers/web-blocgen": "<rootDir>/projects/web-blocgen/src/public_api.ts",
    "^@xlayers/web-blocgen/(.*)": "<rootDir>/projects/web-blocgen/src/lib/$1"
  }
};
