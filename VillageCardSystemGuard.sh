#! /bin/bash
while true; do
    {
        node ./ClassCardSystemServer.js
        echo "ClassCardSystemServer stopped unexpected, restarting"
    }
    sleep 1
done