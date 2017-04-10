/*
ReactQL starter kit -- https://reactql.org
Authored by Lee Benson <lee@leebenson.com>
*/

// ----------------------
// IMPORTS

// Node
const path = require('path');
const fse = require('fs-extra');
const spawn = require('cross-spawn');

// Third-party
const chalk = require('chalk');
const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const inquirer = require('inquirer');
const through2 = require('through2');
const klaw = require('klaw');
const ejs = require('ejs');
const exists = require('command-exists').sync;
const spdx = require('spdx');

// Local
const banner = require('./banner.js');
const usage = require('./usage.js');
const package = require('../package.json');

// ----------------------

// Check for ReactQL updates automatically
updateNotifier({ pkg: package, updateCheckInterval: 0 }).notify();

/*
 Helper functions
*/

// Show error message.  We'll use this if yarn/npm throws back a non-zero
// code, to display the problem back to the console
function showError(msg) {
  console.error(`
${chalk.bold.bgRed('ERROR')}${chalk.bgRed(' -- See the output below:')}

${msg}
  `.trim());
}

// Finished instructions.  Show the user how to use the starer kit
function finished(dir) {
  return `
${separator}
${'\uD83D\uDE80'}  We have lift off!  You starter kit is ready.

First, navigate to your new project folder:
${chalk.bgRed.white(`cd ${dir}`)}

Start a dev server on ${chalk.blue.underline('http://localhost:8080')}:
${chalk.bgRed.white('npm start')}

Build for production:
${chalk.bgRed.white('npm run build')}

Start production server on ${chalk.blue.underline('http://localhost:4000')} (after building):
${chalk.bgRed.white('npm run server')}

Docs/help available at ${chalk.blue.underline('https://reactql.org')}

Don't forget to ${'\u2B50'}  us on GitHub!
${chalk.underline('https://github.com/reactql/cli')}
${separator}

  `.trim();
}

// Paths used during copying the starter kit
const paths = {
  files: path.resolve(__dirname, '../starter/files'),
};

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
    if (!/^none$/i.test(val) && !spdx.valid(val)) {
      return 'Invalid license. Enter "None" if none.';
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
          default: 'ISC',
          validate: validate.license,
          when: validate.option(args.license, validate.license),
        },
        {
          name: 'path',
          type: 'input',
          message: 'Where to install?',
          default(answers) {
            const dir = answers.name || args.name;
            let current = process.cwd();

            return dir ? path.resolve(current, dir) : current;
          },
          validate: validate.path,
          when: validate.option(args.path, validate.path),
        },
      ];

      // Once questions have been answered, we'll have an `answers` object
      // containing the responses
      inquirer.prompt(questions).then(answers => {

        // Inject answers to our `args`, so that we've got a complete set
        // of options to use
        Object.assign(args, answers);

        // Modify path to be absolute
        args.path = path.resolve(process.cwd(), args.path);

        // Copy the starter kit files over to the new path
        fse.copySync(paths.files, args.path);

        // Edit `package.json` with project-specific information
        const packageJsonFile = path.resolve(args.path, 'package.json');
        const packageJson = require(packageJsonFile);

        fse.writeJsonSync(packageJsonFile, Object.assign(packageJson, {
          name: args.name,
          description: args.desc,
          license: args.license,
        }));

        /*
         Find template files, execute the EJS, and create a new file
         with the rendered content.
        */

        // We'll use `klaw` to walk through the starter kit path, and create
        // a stream of `fs.Stats` objects representing each file
        klaw(args.path)

          // Create a function that will handle file objects, determine whether
          // we have templates, and compile to EJS.  We're using `through2` to
          // take care of handling the stream
          .pipe(through2.obj(function(item, enc, next) {

            // We're only interested in `.reactql` template files
            if (/\.reactql$/.test(item.path)) {

              // Get the file content
              const content = fse.readFileSync(item.path, {
                encoding: 'utf8',
              });

              // Compile the template through EJS, passing `args`
              const compiled = ejs.render(content, { args });

              // Write the content to the file, minus the .reactql extension
              fse.writeFileSync(
                item.path.replace(/\.reactql$/, ''),
                compiled,
                {
                  encoding: 'utf8',
                }
              );

              // Delete the template
              fse.unlinkSync(item.path);
            }
            // Callback to say we've completed walking the tree
            next();
          }))
          // When finished, all of our templates have been run
          .on('finish', () => {
            // Install the `package.json` dependencies using yarn if we have
            // it, otherwise using NPM
            let installer;

            // Show the separator to make it clear we've moved on to the
            // next step
            console.log(separator);

            // Prefer yarn (it's faster). If it doesn't exist, fall back to
            // npm which every user should have.  Inform the user that yarn is
            // the preferred option!
            if (exists('yarn')) {
              installer = ['yarn', []];
              console.log('Installing via Yarn...\n');

            } else {
              installer = ['npm', ['i']];
              console.log(`Yarn not found; falling back to NPM. Tip: For faster future builds, install ${chalk.underline('https://yarnpkg.com')}\n`);
            }

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
              // When finished, stop the spinner, update with usage instructons and exit
              .on('close', function () {
                clearInterval(update);
                ui.updateBottomBar('');
                console.log(finished(args.path));
                process.exit();
              });
          });
      });
    },
  })
  .command({
    command: 'version',
    aliases: ['v'],
    desc: 'Show ReactQL version',
    handler() {
      console.log(package.version);
    },
  })
  .option('name', {
    alias: 'n',
    describe: 'New project name',
  })
  .option('desc', {
    alias: 'd',
    describe: 'Project description',
  })
  .option('path', {
    alias: 'p',
    describe: 'Path to install the starter kit',
  })
  .option('license', {
    alias: 'l',
    describe: 'License for package.json',
  })
  .help()
  .argv;

// If no arguments are given, show the help
if (!args._.length) {
  yargs.showHelp();
}
