module.exports = {
  roots: [
    "<rootDir>/tests/integration",
    "<rootDir>/packages"
  ],
  globals: {
    "ts-jest": {
      tsConfig: "packages/xlayers/tsconfig.spec.json"
    },
    __TRANSFORM_HTML__: true
  },
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["./jest.ts"],
  moduleNameMapper: {
    "^\@app/(.*)": "<rootDir>/packages/xlayers/src/app/$1",
    "^\@env/(.*)": "<rootDir>/packages/xlayers/src/environments/$1",
    "^\@xlayers/(.*)": "<rootDir>/packages/$1/src/lib",
    "^\@xlayers/(.*)": "<rootDir>/packages/$1/src/public_api.ts"
  }
}
