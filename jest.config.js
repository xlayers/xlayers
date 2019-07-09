module.exports = {
  roots: [
    "<rootDir>/tests/integration",
    "<rootDir>/projects",
    "<rootDir>/src"
  ],
  globals: {
    "ts-jest": {
      tsConfig: "src/tsconfig.spec.json"
    },
    __TRANSFORM_HTML__: true
  },
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["./jest.ts"],
  moduleNameMapper: {
    "^\@app/(.*)": "<rootDir>/src/app/$1",
    "^\@env/(.*)": "<rootDir>/src/environments/$1",
    "^\@xlayers/(.*)": "<rootDir>/projects/$1/src/lib",
    "^\@xlayers/(.*)": "<rootDir>/projects/$1/src/public_api.ts"
  }
}
