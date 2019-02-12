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
  setupFilesAfterEnv: ["./jest.ts"],
  moduleNameMapper: {
    "^\@app/(.*)": "<rootDir>/packages/xlayers/src/app/$1",
    "^\@env/(.*)": "<rootDir>/packages/xlayers/src/environments/$1",
    "^\@xlayers/(.*)": "<rootDir>/dist/$1"
  }
}
