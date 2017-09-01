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
const boxen = require('boxen');
const chalk = require('chalk');
const yargs = require('yargs');
const emoji = require('node-emoji');
const updateNotifier = require('update-notifier');
const semver = require('semver');
const inquirer = require('inquirer');
const spdx = require('spdx');
const fse = require('fs-extra');
const spawn = require('cross-spawn');
const temp = require('temp').track();
const yauzl = require('yauzl');
const request = require('request');
const mkdirp = require('mkdirp');
const sortObj = require('sort-object');

// Local
const banner = require('./banner.js');
const usage = require('./usage.js');
const pkg = require('../package.json');

// ----------------------

const kit = {
  version: '2.7.0',
  date: '2017-09-01',
}

// Notice placeholder, for displaying a message back to the user before
// key events -- like prior to starting a new project, or checking the version
let notice;

/*
 Helper functions
*/

// If there's a notice to display, show it -- otherwise, ignore.
function showNotice() {
  if (notice) console.log(notice);
}

// Show error message.  We'll use this if yarn/npm throws back a non-zero
// code, to display the problem back to the console
function fatalError(msg) {
  console.error(`
${chalk.bold.bgRed('ERROR')}${chalk.bgRed(' -- See the output below:')}

${msg}
  `.trim());
  process.exit(1);
}

// Finished instructions.  Show the user how to use the starter kit
function finished(dir) {
  return `
${separator}
${emoji.get('rocket')} We have lift off! Your starter kit is ready.

First, navigate to your new project folder:
${chalk.bgRed.white(`cd ${dir}`)}

Start a dev server on ${chalk.cyan.underline('http://localhost:8080')} (browser) / ${chalk.cyan.underline('http://localhost:8081')} (SSR):
${chalk.bgRed.white('npm start')}

Build for production:
${chalk.bgRed.white('npm run build')}

Start production server on ${chalk.cyan.underline('http://localhost:4000')} (after building):
${chalk.bgRed.white('npm run server')}

Docs/help available at ${chalk.cyan.underline('https://reactql.org')}

Don't forget to ${emoji.get('star')} us on GitHub!
${chalk.underline('https://github.com/reactql/cli')}

Follow us on ${emoji.get('bird')} Twitter for news/updates:
${chalk.underline('https://twitter.com/reactql')}
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

// Get the ZIP stream.  This is used for both first-time installs as well
// as upgrades
function startInstallation(installationPath, isUpgrade = false) {
  // Create a tmp file stream to save the file locally
  const file = temp.createWriteStream();

  // Path to `package.json`
  const packagePath = path.resolve(installationPath, 'package.json');

  // If we're upgrading, there ought to be a `package.json` file in the
  // installation path that we'll want to merge with.  Load that into
  // memory, so we can merge it with the new `package.json` later
  let existingPackageJson;

  if (isUpgrade) {
    try {
      existingPackageJson = fse.readJsonSync(packagePath);
    } catch (e) { /* ignore any errors */ }
  }

  // Show the separator to make it clear we've moved on to the
  // next step
  console.log(separator);
  console.log(`Downloading kit v${kit.version} from Github...`);

  // Download the .zip containing the kit's source code
  request
    .get(`https://github.com/reactql/kit/archive/${kit.version}.zip`)
    .pipe(
      file.on('finish', () => {
        console.log('Extracting archive...');
        yauzl.open(file.path, { lazyEntries: true }, (e, zip) => {
          if (e) fatalError("Couldn't read zip file");

          // Kick-start reading the first zip entry
          zip.readEntry();

          // Process zip files as they're streamed
          zip.on('entry', entry => {
            // Remove leading folder that Github uses
            const fileName = entry.fileName
              .split('/')
              .slice(1)
              .join('/');

            // Files to skip
            const skip = [
              /^README\.md$/,
              /^CHANGELOG\.md$/,
              /^LICENSE$/,
            ];

            // Skip `src/*` if upgrading
            if (isUpgrade) skip.push(/^src\//);

            // If the current file is one to skip, move on...
            if (skip.find(toSkip => toSkip.test(fileName)))
              return zip.readEntry();

            // Proceed only if we have a file name
            if (fileName) {

              // Resolve the full file name, including the path
              const fullName = path.resolve(installationPath, fileName);

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
            // If we're upgrading a kit...
            if (isUpgrade) {

              // Delete common NPM lock files
              ['yarn.lock', 'package-lock.json'].forEach(lockFile => {
                try {
                  fse.removeSync(path.resolve(installationPath, lockFile));
                } catch (e) { /* ignore errors */ }
              });

              // If we have an existing `package.json`, merge it with the old
              if (existingPackageJson) {
                console.log('Merging package.json...');

                try {
                  // Load the new `package.json`
                  const newPackageJson = fse.readJsonSync(packagePath);

                  // Merge `dependencies`, `devDependencies` and `scripts`
                  ['dependencies', 'devDependencies', 'scripts'].forEach(key => {
                    existingPackageJson[key] = sortObj(Object.assign({},
                      existingPackageJson[key],
                      newPackageJson[key]
                    ));
                  });

                  // Overwrite `package.json`
                  fse.writeJsonSync(packagePath, existingPackageJson);

                } catch (e) { /* ignore errors */ }
              }


            } else {
              // Only if we're installing a new kit...
              const pkgJsonFile = path.resolve(installationPath, 'package.json');
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
            }

            // Add/edit `.reactql` file containing the current version, to enable
            // later upgrades
            fse.writeFileSync(
              path.resolve(installationPath, '.reactql'),
              kit.version
            );

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
            spawn(...installer, {cwd: installationPath, stdio: 'pipe'})
              .stdout.pipe(ui.log)
              .on('error', () => fatalError("Couldn't install packages"))
              // When finished, stop the spinner, update with usage instructons and exit
              .on('close', function () {
                clearInterval(update);
                ui.updateBottomBar('');

                // If running on Windows, `node rebuild node-sass` to fix
                // https://github.com/reactql/cli/issues/64
                if (os.platform() === 'win32') {
                  console.log('Rebuilding SASS support for Windows...');
                  spawn.sync('npm', ['rebuild', 'node-sass'], {
                    cwd: installationPath,
                    stdio: 'inherit',
                  });
                }

                if (isUpgrade) {
                  console.log(
                    chalk.green(`Upgraded project to ReactQL kit v${kit.version}`)
                  );
                } else {
                  console.log(finished(installationPath));
                }

                process.exit();
              });
          });
        })
      })
    )
    .on('error', () => {
      console.error("Couldn't download source code from Github");
      process.exit(1);
    });
}

// Banners / text snippets
const separator = `
================================================================================
`;

const preQuestion = `
${separator}
${banner}

Spawning new project...
`.trimLeft();

// Check that the installed Node version meets requirements: 7.6+
if (!semver.gte(process.version, '7.6.0')) {
  let warning = `${chalk.bold('Warning')}: You need Node.js 7.6 or above for ReactQL to work properly.\n`;
  warning += `You have ${process.version}. Upgrade @ ${chalk.cyan.underline('https://nodejs.org')}`;

  console.log(boxen(chalk.red(warning), { padding: 1 }));
}

// Set command / arg options.  A user can specify args/switches to the `reacql`
// command, or just type `reactql new` and walk through the 'wizard'
const args = yargs
  .usage(usage)
  .command({
    command: 'upgrade',
    aliases: ['u'],
    desc: `Upgrade existing ReactQL project to kit v${kit.version}`,
    handler() {
      const cwd = process.cwd();
      let currentVersion;

      try {
        // Check that we're inside an active ReactQL project by looking for a
        // `.reactql` file, and attempting to read its contents
        try {
          currentVersion = fse.readFileSync(path.resolve(cwd, '.reactql'), 'utf8').trim();
        } catch(e) {
          throw new Error('This is not a ReactQL project folder - `.reactql` missing');
        }

        // Is the contents of `.reactql` a valid semver?
        if (!semver.valid(currentVersion)) {
          throw new Error('Invalid ReactQL version inside `.reactql`');
        }

      } catch (e) {
        console.log(
          chalk.red(`Error: ${e.message}`)
        );
        process.exit(1);
      }

      // Is there even a newer version available?
      if (!semver.lt(currentVersion, kit.version)) {
        console.log(`Already at latest version (v${currentVersion})`);
        return;
      }

      // Confirm that the user is happy to overwrite existing files
      let warning = `${chalk.red.underline('Warning:')} Your ReactQL project will be `;
      warning += `upgraded from ${chalk.dim(currentVersion)} -> ${chalk.green(kit.version)}\n`;
      warning += `By proceeding, existing ReactQL files/dirs will be overwritten (except ${chalk.bgYellow('src/*')})`;

      console.log(
        boxen(warning, {
          padding: 1,
        })
      );

      const questions = [
        {
          name: 'confirm',
          type: 'confirm',
          message: `Upgrade to ReactQL kit v${kit.version}?`,
        },
      ];

      // Once questions have been answered, we'll have an `answers` object
      // containing the responses
      inquirer.prompt(questions).then(answers => {

        // If the user has elected not to upgrade, simply return
        if (!answers.confirm) return;

        // Yup, upgrade is a go...
        startInstallation(cwd, true);
      });
    }
  })
  .command({
    command: 'new',
    aliases: ['n'],
    desc: 'Create new project',
    handler(args) {
      console.log(preQuestion);
      showNotice();

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
      ];

      // Once questions have been answered, we'll have an `answers` object
      // containing the responses
      inquirer.prompt(questions).then(answers => {
        // Inject answers to our `args`, so that we've got a complete set
        // of options to use
        Object.assign(args, answers);

        // Modify path to be absolute
        args.path = path.resolve(process.cwd(), args.path);

        // Install the kit's .zip to the required folder
        startInstallation(args.path, false);
      });
    },
  })
  .command({
    command: 'version',
    aliases: ['v'],
    desc: 'Show ReactQL version',
    handler() {
      console.log(pkg.version);
      showNotice();
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
  })
  .help();

// Check for ReactQL updates automatically.  This overrides `update-notifier`'s
// default behaviour of checking in a separate child process (and then displaying
// the message the next time it's run), since it's likely a user would want to
// know if an update was available before starting a new project
updateNotifier({
  pkg,
  updateCheckInterval: 0,
  callback(e, update) {
    // If there's an error checking for updates, direct the user to NPM
    if (e) {
      notice = chalk.red(`Error checking for ReactQL updates. Try ${chalk.bold.underline('https://www.npmjs.com/package/reactql')}`);

    } else if (update && semver.lt(pkg.version, update.latest)) {
      // There's an update available...
      notice = `${chalk.bold.magenta('ReactQL')} CLI update available: `;
      notice += `${chalk.dim(pkg.version)} -> ${chalk.bold.green(update.latest)}\n\n`;
      notice += `Run ${chalk.cyan('npm i -g reactql')} to upgrade.`;

      // Wrap `notice` in a box to make it obvious
      notice = boxen(notice, {
        padding: 1,
        borderColor: 'green',
      });
    }

    // Parse the CLI arguments via `yargs`
    const cli = args.argv;

    // If no arguments are given, show the help
    if (!cli._.length) {
      yargs.showHelp();
      showNotice();
    }
  }
});
