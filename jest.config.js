module.exports = {
  roots: ["<rootDir>/tests", "<rootDir>/projects", "<rootDir>/src"],
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
    "^@xlayers/sketch-ingestor": "<rootDir>/projects/sketch-ingestor/src/public_api.ts",
    "^@xlayers/sketch-ingestor/(.*)": "<rootDir>/projects/sketch-ingestor/src/lib/$1",
    "^@xlayers/std-blocgen": "<rootDir>/projects/std-blocgen/src/public_api.ts",
    "^@xlayers/std-blocgen/(.*)": "<rootDir>/projects/std-blocgen/src/lib/$1",
    "^@xlayers/css-blocgen": "<rootDir>/projects/css-blocgen/src/public_api.ts",
    "^@xlayers/css-blocgen/(.*)": "<rootDir>/projects/css-blocgen/src/lib/$1",
    "^@xlayers/text-blocgen": "<rootDir>/projects/text-blocgen/src/public_api.ts",
    "^@xlayers/text-blocgen/(.*)": "<rootDir>/projects/text-blocgen/src/lib/$1",
    "^@xlayers/svg-blocgen": "<rootDir>/projects/svg-blocgen/src/public_api.ts",
    "^@xlayers/svg-blocgen/(.*)": "<rootDir>/projects/svg-blocgen/src/lib/$1",
    "^@xlayers/vue-blocgen": "<rootDir>/projects/vue-blocgen/src/public_api.ts",
    "^@xlayers/vue-blocgen/(.*)": "<rootDir>/projects/vue-blocgen/src/lib/$1",
    "^@xlayers/bitmap-blocgen": "<rootDir>/projects/bitmap-blocgen/src/public_api.ts",
    "^@xlayers/bitmap-blocgen/(.*)": "<rootDir>/projects/bitmap-blocgen/src/lib/$1"
  }
};
