#!/bin/bash

set -u

query='{
    search(first: 1, type: ISSUE, query: "type:pr repo:xlayers/xlayers $COMMIT_SHA") {
        nodes {
        ... on PullRequest {
            id
            }
        }
    }
}'
body='Preview: $PREVIEW_BUILD_URL'

echo ">> Getting the subject ID from GitHub (access_token=$ACCESS_TOKEN)"
subjectId=$(curl -s -X POST \
    --url 'https://api.github.com/graphql?access_token=$ACCESS_TOKEN' \
    --header 'content-type: application/json' \
    --data '{ "query": "$query" }' | python -c 'import sys, json; print json.load(sys.stdin)["data"]["search"]["nodes"][0]["id"]')

echo ">> Sending the Preview Link on issue $subjectId (access_token=$ACCESS_TOKEN)"
curl -X POST \
    --url 'https://api.github.com/graphql?access_token=$ACCESS_TOKEN' \
    --header 'content-type: application/json' \
    --data '{ "query": "mutation AddCommentToIssue { addComment(input: { subjectId: \"$subjectId\",body: \"$body\"}) { clientMutationId }}" }'
