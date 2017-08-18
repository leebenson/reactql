/*
ReactQL starter kit -- https://reactql.org
Authored by Lee Benson <lee@leebenson.com>
*/

// ----------------------
// IMPORTS

// Node
const os = require('os');
const path = require('path');

// Third-party
const chalk = require('chalk');
const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const inquirer = require('inquirer');
const spdx = require('spdx');
const fse = require('fs-extra');
const spawn = require('cross-spawn');
const temp = require('temp').track();
const yauzl = require('yauzl');
const request = require('request');
const mkdirp = require('mkdirp');

// Local
const banner = require('./banner.js');
const usage = require('./usage.js');
const pkg = require('../package.json');

// ----------------------

const versions = {
  'kit': {
    version: '2.4.0',
    date: '2017-08-18',
  },
  /*
    OMITTING TYPESCRIPT KIT FOR NOW, per https://github.com/reactql/kit.ts/issues/18

  'kit.ts': {
    version: '1.1.2',
    date: '2017-04-29',
  },

  */
};

// Check for ReactQL updates automatically
updateNotifier({ pkg, updateCheckInterval: 0 }).notify();

/*
 Helper functions
*/

// Show emoji only on supported platforms.  Otherwise, backspace to erase.
function emoji(ifSupported, ifNot='\b') {
  return os.type() === 'Darwin' ? `${ifSupported} ` : ifNot;
}

// Show error message.  We'll use this if yarn/npm throws back a non-zero
// code, to display the problem back to the console
function fatalError(msg) {
  console.error(`
${chalk.bold.bgRed('ERROR')}${chalk.bgRed(' -- See the output below:')}

${msg}
  `.trim());
  process.exit();
}

// Finished instructions.  Show the user how to use the starter kit
function finished(dir) {
  return `
${separator}
${emoji('\uD83D\uDE80','-->')} We have lift off!  You starter kit is ready.

First, navigate to your new project folder:
${chalk.bgRed.white(`cd ${dir}`)}

Start a dev server on ${chalk.blue.underline('http://localhost:8080')}:
${chalk.bgRed.white('npm start')}

Build for production:
${chalk.bgRed.white('npm run build')}

Start production server on ${chalk.blue.underline('http://localhost:4000')} (after building):
${chalk.bgRed.white('npm run server')}

Docs/help available at ${chalk.blue.underline('https://reactql.org')}

Don't forget to ${emoji('\u2B50',"'star'")} us on GitHub!
${chalk.underline('https://github.com/reactql/cli')}
${separator}

  `.trim();
}

// ASCII chars to show possible 'spinner' positions.  We'll prefix this to
// the installation message during yarn/npm packaging
const spinner = [
  '/',
  '|',
  '\\',
  '-',
];

// Validation functions.  Used to validate args and Inquirer questions
const validate = {

  // Helper function to determine whether the value passed in via options
  // also validates against the Inquirer validation function
  option(value, func) {
    if (typeof value === 'undefined') return true;
    if (func(value) !== true) return true;
    return false;
  },

  // Project name.  Accept a-z/0-9, optionally separated by a hypen or underscore
  // between words.  No spaces.  1-32 characters.
  name(val) {
    if (!/^.{1,32}$/i.test(val)) {
      return 'Between 1-32 characters only';
    }

    return /^([a-z0-9]+[-_]?)*[a-z0-9]$/i.test(val)
      || 'Alphanumeric only. No spaces. One hypens/underscore between words allowed.';
  },

  // Project description.  Accept any character, max length 64.
  desc(val) {
    if (!/^.{0,64}$/i.test(val)) {
      return 'Maximum of 64 characters, please.';
    }

    return true;
  },

  // Project description.  Accept any character, max length 32
  license(val) {
    if (!/^UNLICENSED$/.test(val) && !spdx.valid(val)) {
      return 'Invalid license. Enter "UNLICENSED" if not licensed.';
    }

    return true;
  },

  // Directory to install to.  Creates the folder during the Validation
  // process, which means it must not already exist
  path(val) {
    // Assume the directory exists to begin with
    try {
      const stats = fse.statSync(val);
      // Do we have a directory?
      if (!stats.isDirectory()) {
        return 'Path must be a folder.';
      }
      // Is the folder empty?
      if (fse.readdirSync(val).length) {
        return 'Path must be a new, empty folder.';
      }
    } catch(e) {
      // Error accessing folder.  Let's now try to create it.
      try {
        fse.mkdirSync(val);
      } catch(_) {
        return 'Could not create directory. Enter another path.';
      }
    }

    return true;
  }
};

// Banners / text snippets
const separator = `
================================================================================
`;

const preQuestion = `
${separator}
${banner}

Spawning new project...
`.trimLeft();

// Set command / arg options.  A user can specify args/switches to the `reacql`
// command, or just type `reactql new` and walk through the 'wizard'
const args = yargs
  .usage(usage)
  .command({
    command: 'new',
    aliases: ['n'],
    desc: 'Create new project',
    handler(args) {
      console.log(preQuestion);

      // Questions/options
      const questions = [
        {
          name: 'name',
          type: 'input',
          message: 'Project name?',
          default: 'reactql-app',
          validate: validate.name,
          when: validate.option(args.name, validate.name),
        },
        {
          name: 'desc',
          type: 'input',
          message: 'Project description?',
          default: 'New ReactQL project',
          validate: validate.desc,
          when: validate.option(args.desc, validate.desc),
        },
        {
          name: 'license',
          type: 'input',
          message: 'License?',
          default: 'UNLICENSED',
          validate: validate.license,
          when: validate.option(args.license, validate.license),
        },
        {
          name: 'path',
          type: 'input',
          message: 'Where to install?',
          default(answers) {
            const dir = (answers.name || args.name).toLowerCase();
            let current = process.cwd();

            return dir ? path.resolve(current, dir) : current;
          },
          validate: validate.path,
          when: validate.option(args.path, validate.path),
        },
        // {
        //   name: 'repo',
        //   type: 'list',
        //   message: 'Which version of the kit would you like?',
        //   choices: [
        //     {
        //       name: `Javascript (ES6) - v${versions['kit'].version} (${versions['kit'].date})`,
        //       value: 'kit',
        //     },
        //     {
        //       name: `Typescript - v${versions['kit.ts'].version} (${versions['kit.ts'].date})`,
        //       value: 'kit.ts',
        //     },
        //   ],
        //   when() {
        //     return !(args.js || args.ts);
        //   },
        // }
      ];

      // Once questions have been answered, we'll have an `answers` object
      // containing the responses
      inquirer.prompt(questions).then(answers => {
        // Inject answers to our `args`, so that we've got a complete set
        // of options to use
        Object.assign(args, answers);

        // Modify path to be absolute
        args.path = path.resolve(process.cwd(), args.path);

        // Modify repo based on kit flavour
        // if (args.js) args.repo = 'kit';
        // else if (args.ts) args.repo = 'kit.ts';

        // TODO remove this when Typescript support is re-enabled
        args.repo = 'kit';
        const version = versions[args.repo].version;

        // Create a tmp file stream to save the file locally
        const file = temp.createWriteStream();

        // Show the separator to make it clear we've moved on to the
        // next step
        console.log(separator);
        console.log(`Downloading kit v${version} from Github...`);

        // Download the .zip containing the kit's source code
        request
          .get(`https://github.com/reactql/${args.repo}/archive/${version}.zip`)
          .pipe(
            file.on('finish', () => {
              console.log('Extracting archive...');
              yauzl.open(file.path, { lazyEntries: true }, (e, zip) => {
                if (e) fatalError("Couldn't read zip file");

                // Read the zip entry
                zip.readEntry();

                // Process zip files
                zip.on('entry', entry => {
                  // Remove leading folder that Github uses
                  const fileName = entry.fileName
                    .split('/')
                    .slice(1)
                    .join('/');

                  // Proceed only if we have a file name
                  if (fileName) {

                    // Resolve the full file name, including the path
                    const fullName = path.resolve(args.path, fileName);

                    // If it's a folder (based on original filename), create it
                    if (/\/$/.test(fileName)) {
                      mkdirp(fullName, e => {
                        if (e) fatalError(`Couldn't create folder ${fullName}`);
                        zip.readEntry();
                      });
                    } else {
                      // Otherwise, it's a regular file -- write it
                      zip.openReadStream(entry, (e, readStream) => {
                        if (e) fatalError(`Couldn't create ZIP read stream`);
                        readStream
                          .pipe(fse.createWriteStream(fullName))
                          .on('finish', () => zip.readEntry());
                      });
                    }
                  } else {
                    // Blank filename - move on to the next one
                    zip.readEntry();
                  }
                })
                .on('end', () => {
                  // Edit `package.json` with project-specific information
                  console.log('Writing package.json...');

                  const pkgJsonFile = path.resolve(args.path, 'package.json');
                  const pkgJson = require(pkgJsonFile);

                  fse.writeJsonSync(
                    pkgJsonFile,
                    Object.assign(pkgJson, {
                      name: args.name,
                      description: args.desc,
                      license: args.license,
                    }),
                    {
                      spaces: 2,
                    }
                  );

                  // Remove root files that irrelevant to the new project
                  ['README.md', 'CHANGELOG.md', 'LICENSE'].forEach(file => {
                    try {
                      fse.unlinkSync(path.resolve(args.path, file));
                    } catch(_) { /* ignore errors */ }
                  });

                  // Install package dependencies using NPM
                  const installer = ['npm', ['i']];

                  // Create a bottom bar to display the installation spinner at the bottom
                  // of the console.
                  const ui = new inquirer.ui.BottomBar({ bottomBar: spinner[0] });

                  // Temporary var to track the position of the 'spinner'
                  let i = 0;

                  // Update the spinner every 300ms, to reflect the installation activity
                  const update = setInterval(function () {
                    ui.updateBottomBar(`\n${spinner[++i % 4]} Installing modules -- Please wait...`);
                  }, 300);

                  // Execute yarn/npm as a child process, pipe output to stdout
                  spawn(...installer, {cwd: args.path, stdio: 'pipe'})
                    .stdout.pipe(ui.log)
                    .on('error', () => fatalError("Couldn't install packages"))
                    // When finished, stop the spinner, update with usage instructons and exit
                    .on('close', function () {
                      clearInterval(update);
                      ui.updateBottomBar('');
                      console.log(finished(args.path));
                      process.exit();
                    });
                });
              })
            })
          )
          .on('error', () => {
            console.error("Couldn't download source code from Github");
            process.exit();
          });

        });
    },
  })
  .command({
    command: 'version',
    aliases: ['v'],
    desc: 'Show ReactQL version',
    handler() {
      console.log(pkg.version);
    },
  })
  .options({
    name: {
      alias: 'n',
      describe: 'New project name',
    },
    desc: {
      alias: 'd',
      describe: 'Project description',
    },
    path: {
      alias: 'p',
      describe: 'Path to install the starter kit',
    },
    license: {
      alias: 'l',
      describe: 'License for pkg.json',
    },
    // js: {
    //   describe: 'Install Javascript (ES6) version',
    // },
    // ts: {
    //   describe: 'Install Typescript version',
    // }
  })
  .boolean(['js', 'ts'])
  .help()
  .argv;

// If no arguments are given, show the help
if (!args._.length) {
  yargs.showHelp();
}
