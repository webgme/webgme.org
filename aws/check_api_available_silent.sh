#!/bin/bash

url="https://editor.webgme.org/api/user/data"
response=$(curl --silent -o /dev/null -w "%{http_code}" "$url")

if [ "$response" -eq 200 ]; then
    exit 0
else
    echo "Request failed with HTTP status code $response"
    exit 1
fi
