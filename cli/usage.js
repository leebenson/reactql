/*
ReactQL starter kit -- https://reactql.org
Authored by Lee Benson <lee@leebenson.com>
*/

// ----------------------
// IMPORTS

// Node
const chalk = require('chalk');
const emoji = require('node-emoji');

// Local
const banner = require('./banner.js');

// ----------------------
module.exports = `
================================================================================

${banner}

Usage:

Start a new ReactQL project
${chalk.white.bgRed('reactql new [options]')}

Show help / all options
${chalk.white.bgRed('reactql help')}

Show the current version / check for latest version:
${chalk.white.bgRed('reactql version')}

Follow us on ${emoji.get('bird')} Twitter for news/updates:
${chalk.underline('https://twitter.com/reactql')}

================================================================================
`.trim();
