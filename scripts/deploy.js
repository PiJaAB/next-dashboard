/* eslint-disable no-console,@typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const execa = require('execa');

(async () => {
  await execa('git', ['fetch', 'origin', 'build/v5']);
  await execa('git', ['checkout', '--detach']);
  await execa('git', ['reset', '--soft', 'origin/build/v5']);
  await execa('git', ['add', '--all']);
  await execa('git', ['reset', '--', 'node_modules', 'scripts']);
  await execa('git', ['commit', '-m', 'build']);
  console.log('Pushing to build branch...');
  await execa('git', ['push', 'origin', 'HEAD:build/v5', '--force']);
  console.log('Successfully deployed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
