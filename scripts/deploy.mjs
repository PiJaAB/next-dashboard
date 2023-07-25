/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
import { execa } from 'execa';
import semver from 'semver';
import pkg from '../package/package.json' assert { type: 'json' };

const major = semver.major(pkg.version);

(async () => {
  let newBranch = false;
  try {
    await execa('git', ['fetch', 'origin', `build/v${major}`]);
  } catch (err) {
    const stdErr = err.stderr;
    console.log(stdErr, /^fatal: couldn't find remote ref build\/v/.test(stdErr));
    if (typeof stdErr === 'string' && /^fatal: couldn't find remote ref build\/v/.test(stdErr)) {
      console.log(`Branch build/v${major} does not exist. Creating...`);
      newBranch = true;
    } else {
      throw err;
    }
  }
  if (newBranch) {
    await execa('git', ['checkout', '--orphan', `build/v${major}`]);
  } else {
    await execa('git', ['checkout', '--detach']);
    await execa('git', ['reset', '--soft', `origin/build/v${major}`]);
  }
  await execa('git', ['add', '--all']);
  await execa('git', ['reset', '--', 'node_modules', 'scripts']);
  await execa('git', ['commit', '--allow-empty', '-m', 'build']);
  console.log('Pushing to build branch...');
  // await execa('git', ['push', 'origin', `HEAD:build/v${major}`, '--force']);
  console.log('Successfully deployed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
