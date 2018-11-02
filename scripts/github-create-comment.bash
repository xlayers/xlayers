#!/bin/bash

set -u

access_token=$GITHUB_ACCESS_TOKEN

echo ">> Getting the subject ID for commit=$COMMIT_SHA (access_token=$access_token)"

subject_id=$(curl  -v  --url "https://api.github.com/graphql?access_token=$access_token" \
        --header 'content-type: application/json' \
        --data "{ \"query\": \"{ search(first: 1, type: ISSUE, query: \\\"type:pr repo:xlayers/xlayers $(COMMIT_SHA)\\\") { nodes { ... on PullRequest { id, number, title } } } }\" }")

echo ">> Received..."
echo $subject_id

subject_id=`echo $subject_id | python -c 'import sys, json; print json.load(sys.stdin)["data"]["search"]["nodes"][0]["id"]'`

if [ $? -eq 1 ]; then
    echo "Could not get Subject ID. Abort."
    echo $subject_id
    exit 0;
fi

echo ">> Sending the Preview Link on issue $subject_id (access_token=$access_token)"
body='Preview: $PREVIEW_BUILD_URL'

curl --url "https://api.github.com/graphql?access_token=$access_token" \
  --header 'content-type: application/json' \
  --data "{ \"query\": \"mutation AddCommentToIssue { addComment(input: {subjectId: \\\"$subject_id\\\", body: \\\"$body\\\"}) { clientMutationId } }\" }"