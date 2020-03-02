import { cmd, runTask, packages, git } from './utils';
import { buildAllLibraries } from './build-all-libraries';
const { cp, rm, mkdir, ls } = require('shelljs');

export async function publishLibrary() {
  const pkg = process.argv[2];
  try {
    if (!pkg) {
      throw new Error('There is no package specified');
    } else if (!packages.includes(pkg)) {
      throw new Error('There is no package from our list');
    }
  } catch {
    process.exit();
  }
  const PROJECT_FOLDER = `./projects/${pkg}`;
  const DIST_PROJECT_FOLDER = `./dist/${pkg}`;
  const TMP_FOLDER = String.raw`${pkg}`;
  const DESTINATION_REPO = `git@github.com:xlayers/r${pkg}-build.git`;

  const COMMITTER_USER_NAME = await git([
    `--no-pager show -s --format='%cN' HEAD`
  ]);
  const COMMITTER_USER_EMAIL = await git([
    `--no-pager show -s --format='%cE' HEAD`
  ]);

  await mkdir(`tmp`);
  await process.chdir('tmp');
  await cmd('mkdir ', [`${TMP_FOLDER}`]);
  // git init
  await process.chdir(`${TMP_FOLDER}`);
  await ls();
  await git([`init`]);
  // add remote
  await git([`remote add origin ${DESTINATION_REPO}`]);
  // fetch master
  await git([`fetch`]);
  await git(['checkout master']);

  // // go to project folder
  await process.chdir('../../');
  await process.chdir(PROJECT_FOLDER);

  // run release-it for bump version
  await cmd('npx', [`release-it --ci --dry-run`]);
  // // after version bump we need to rebuild our library
  await buildAllLibraries();

  // // go to tmp folder
  await process.chdir('../../');
  await git([`log --format="%h %s" -n 1 > tmp/${TMP_FOLDER}/commit_message`]);
  console.log(DIST_PROJECT_FOLDER, TMP_FOLDER);
  await cp('-R', `${DIST_PROJECT_FOLDER}/*`, `tmp/${TMP_FOLDER}`);
  await process.chdir(`tmp/${TMP_FOLDER}`);
  await git([`config user.name "${COMMITTER_USER_NAME}"`]);
  await git([`config user.email "${COMMITTER_USER_EMAIL}"`]);
  await git(['add --all']);
  // ignore commit_message file
  await git(['reset -- commit_message']);
  await git([`commit -F commit_message`]);
  await rm('-rf', 'commit_message');

  await git(['push origin master --force']);
  // clean temp dir and make temp dir
  await rm('-rf', './dist');
  await rm('-rf', './tmp/*');
  await rm('-rf', './tmp');
  await process.exit(0);
}

runTask('Publish library', async () => await publishLibrary());
