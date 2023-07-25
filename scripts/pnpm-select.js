const { spawnSync } = require("node:child_process");

const extraFilter = process.argv[3] ? `--filter={./Projects/${process.argv[3]}}` : undefined;

spawnSync("pnpm", ['--parallel', '--stream', `--filter={./package}`, ...(extraFilter ? [extraFilter] : []), "run", process.argv[2], ...process.argv.slice(4)], {
  stdio: 'inherit',
});
