const simpleGit = require('simple-git');
const replace = require('replace-in-file');
const git = simpleGit();

/** Get build number from current git revision */
const getBuildNumber = () =>
  Promise.all([
    git.revparse(['--abbrev-ref', 'HEAD']),
    git.revparse(['--short', 'HEAD']),
  ]).then(([b, v]) => `${b}+sha.${v}`);

/** Replace _BUILD_HASH_ in dist files with the current build number */
const replaceBuildHash = (buildNumber) =>
  replace({
    from: /_BUILD_HASH_/g,
    to: buildNumber,
    files: 'dist/**/**/*.js',
  }).then(() => buildNumber);

// Run script
getBuildNumber()
  .then(replaceBuildHash)
  .then((buildNumber) => {
    console.log(`Build was stamped: ${buildNumber}`);
  })
  .catch((e) => {
    console.error('Could not stamp this build!', e);
  });
