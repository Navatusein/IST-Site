#!/bin/sh

chown -R $UID:$GID /app/public/files
exec node server.js