#!/bin/sh
# Kill any previous proxy process
pkill -f ta-proxy.js || true
# Start the proxy server in the background
node ta-proxy.js &

# Start the Expo app
npm run start 