/*
ReactQL starter kit -- https://reactql.org
Authored by Lee Benson <lee@leebenson.com>
*/

// ----------------------
// IMPORTS

// Local
const package = require('../package.json');

// ----------------------
module.exports = `
██████╗ ███████╗ █████╗  ██████╗████████╗ ██████╗ ██╗
██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔═══██╗██║
██████╔╝█████╗  ███████║██║        ██║   ██║   ██║██║   v${package.version}
██╔══██╗██╔══╝  ██╔══██║██║        ██║   ██║▄▄ ██║██║
██║  ██║███████╗██║  ██║╚██████╗   ██║   ╚██████╔╝███████╗
`.trim();
