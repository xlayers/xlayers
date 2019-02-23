workflow "Main" {
  on = "push"
  resolves = [
    "Test",
    "GitHub Action for Firebase",
    "Prebuild libraries",
    "Install dependencies",
  ]
}

action "Select master branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Install dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Select master branch"]
  args = "install"
}

action "Prebuild libraries" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install dependencies"]
  args = "run prebuild"
}

action "Lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Prebuild libraries"]
  args = "run lint"
}

action "Test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Prebuild libraries"]
  args = "run test"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Lint", "Test"]
  args = "run build"
}

action "GitHub Action for Firebase" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["Build"]
  secrets = ["FIREBASE_TOKEN", "PROJECT_ID"]
  args = "deploy"
}
