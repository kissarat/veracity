#!/usr/bin/env bash

for filename in `find . -iname *.js`; do
    found=$(grep entrypoint "$filename")
    test -z "$found" || echo $filename 
done
