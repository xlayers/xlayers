module.exports = {
  roots: [
    "<rootDir>/tests",
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
    "^\@xlayers/(.*)": "<rootDir>/dist/$1"
  }
}
