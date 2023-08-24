#!/bin/bash

url="https://editor.webgme.org/api/user/data"
response=$(curl -o /dev/null -w "%{http_code}" "$url")

if [ "$response" -eq 200 ]; then
    echo "Request successful (HTTP 200 OK)"
    exit 0
else
    echo "Request failed with HTTP status code $response"
    exit 1
fi
