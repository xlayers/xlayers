workflow "Auto Release" {
  resolves = [
    "Install dependencies",
    "Lint",
    "Test",
    "Release",
  ]
  on = "release"
}

action "Master branch only" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Install dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Master branch only"]
  args = "install"
}

action "Lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install dependencies"]
  args = "run lint"
}

action "Test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Lint"]
  args = "run test"
}

action "Prebuild libraries" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Lint", "Test"]
  args = "run lib.build.prod"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Prebuild libraries"]
  args = "run app.build.prod"
}

action "Stamp Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Build"]
  args = "run app.build.stamp"
}

action "Deploy" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["Stamp Build"]
  secrets = ["FIREBASE_TOKEN", "PROJECT_ID"]
  args = "deploy"
}

action "Release" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Deploy"]
  args = "run release"
  secrets = ["GITHUB_TOKEN"]
}
