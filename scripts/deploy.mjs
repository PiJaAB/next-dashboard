/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
import { execa } from "execa";
import { mkdirSync, rmSync, readFileSync } from "node:fs";
import semver from "semver";

const pkg = JSON.parse(readFileSync("package/package.json", "utf-8"));

const major = semver.major(pkg.version);

(async () => {
  try {
    await execa("git", ["diff", "--quiet"]);
  } catch (err) {
    console.error("Working directory is not clean");
    process.exit(1);
  }

  console.log("Setting up deploy working directory...");
  try {
    rmSync(".buildpkg", { recursive: true, force: true });
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
  mkdirSync(".buildpkg");
  console.log("Packing project...");
  const archive = (
    await execa("pnpm", ["-C", "package", "pack", "--pack-destination", ".."])
  ).stdout
    .split("\n")
    .pop();
  console.log("Archive location: %s", archive);
  console.log("Unpacking project to doploy working directory...");
  await execa("tar", [
    "--strip-components",
    "1",
    "-C",
    ".buildpkg",
    "-xf",
    archive,
  ]);
  let newBranch = false;

  console.log("Copying .git folder...");
  await execa("cp", ["-r", ".git", ".buildpkg"]);
  
  try {
    console.log(`Fetching build/v${major} branch...`);
    await execa("git", ["fetch", "origin", `build/v${major}`], {
      cwd: ".buildpkg",
    });
  } catch (err) {
    const stdErr = err.stderr;
    if (
      typeof stdErr === "string" &&
      /^fatal: couldn't find remote ref build\/v/.test(stdErr)
    ) {
      newBranch = true;
    } else {
      throw err;
    }
  }
  if (newBranch) {
    console.log(
      `Remote branch build/v${major} does not exist. Creating new orphan branch...`
    );
    await execa("git", ["checkout", "--orphan", `build/v${major}`], {
      cwd: ".buildpkg",
    });
  } else {
    console.log(`Checking out detached history of build/v${major}...`);
    await execa("git", ["checkout", "--detach"], { cwd: ".buildpkg" });
    await execa("git", ["reset", "--soft", `origin/build/v${major}`], {
      cwd: ".buildpkg",
    });
  }
  console.log("Adding files...");
  await execa("git", ["add", "--all"], { cwd: ".buildpkg" });
  await execa("git", ["reset", "--", "node_modules", "scripts"], {
    cwd: ".buildpkg",
  });

  console.log("Committing...");
  await execa("git", ["commit", "--allow-empty", "-m", `build for ${sha}`], {
    cwd: ".buildpkg",
  });
  console.log("Pushing to build branch...");
  await execa("git", ["push", "origin", `HEAD:build/v${major}`], {
    cwd: ".buildpkg",
  });
  console.log("Cleaning up git repository...");
  await execa("rm", ["-rf", `.git`], { cwd: ".buildpkg" });
  console.log("Successfully deployed");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
