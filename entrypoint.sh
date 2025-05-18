#!/bin/sh

chown -R $UID:$GID /app/public
chmod -R 666 /app/public

exec su-exec $UID:$GID node server.js