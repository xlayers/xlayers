workflow "New workflow" {
  on = "push"
  resolves = ["GitHub Action for npm"]
}

action "node" {
  uses = "actions/npm@e7aaefe"
  runs = "install"
}

action "GitHub Action for npm" {
  uses = "actions/npm@e7aaefe"
  needs = ["node"]
  runs = "test"
}
