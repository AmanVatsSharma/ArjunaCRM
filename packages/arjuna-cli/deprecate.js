#!/usr/bin/env node
const message = `\nArjunaCRM CLI (arjuna-cli) is deprecated.\n\nPlease install and use the new package instead:\n  npm install -g arjuna-sdk\n\nThe command name remains the same: \"arjuna\".\nMore info: https://www.npmjs.com/package/arjuna-sdk\n`;

console.error(message);
process.exitCode = 1;
