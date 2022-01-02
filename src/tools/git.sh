#!/usr/bin/env bash

function branch() {
    git rev-parse --abbrev-ref HEAD
}

function push() {
    git push origin $(branch)
}

function status() {
    git status
}

function commit() {
    local message="$@"
    [ -z "$message" ] && fail 'Commit message is empty' && return 1
    # if [[ ! ${#message} > 4 ]]; then
    #     fail 'Commit message mast contain at least 4 charaters' && return
    # fi    
    git add -A
    git commit -m "$message"
    git push origin $(branch)
}
