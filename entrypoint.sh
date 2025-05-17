#!/bin/sh

chown -R $UID:$GID /app/public/files
exec su-exec $UID:$GID node server.js