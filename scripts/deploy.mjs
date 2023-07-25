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
  console.log("Getting git config...");
  const sha = (await execa("git", ["rev-parse", "--short", "HEAD"])).stdout;
  const fetchUrls = (
    await execa("git", ["remote", "get-url", "--all", "origin"])
  ).stdout
    .split("\n")
    .filter((url) => url.trim().length > 0);
  const pushUrls = (
    await execa("git", ["remote", "get-url", "--all", "--push", "origin"])
  ).stdout
    .split("\n")
    .filter((url) => url.trim().length > 0);

  console.log(`Current commit: ${sha}`);

  const identical =
    pushUrls.length === fetchUrls.length &&
    pushUrls.every((url, i) => url === fetchUrls[i]);

  if (identical) {
    console.log(`Found remote urls: ${fetchUrls.join(", ")}`);
  } else {
    console.log(
      `Found remote urls: ${fetchUrls.join(", ")} (push: ${pushUrls.join(
        ", "
      )})`
    );
  }

  if (fetchUrls.length === 0) {
    console.error("No remote origin found");
    process.exit(1);
  }
  if (pushUrls.length === 0) {
    console.error("Origin remote is missing push urls");
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

  console.log("Setting up git repository in package directory...");
  await execa("git", ["init"], { cwd: ".buildpkg" });

  console.log("Adding origin remote...");
  await execa("git", ["remote", "add", "origin", fetchUrls[0]], {
    cwd: ".buildpkg",
  });
  if (fetchUrls.length > 1) {
    console.log(
      `Adding extra ${!identical ? "fetch " : ""}url${
        fetchUrls.length > 2 ? "s" : ""
      } to origin remote...`
    );
    for (let i = 1; i < fetchUrls.length; i++) {
      await execa(
        "git",
        ["remote", "set-url", "--add", "origin", fetchUrls[i]],
        { cwd: ".buildpkg" }
      );
    }
  }
  if (!identical) {
    console.log(
      `Adding push url${pushUrls.length > 1 ? "s" : ""} to origin remote...`
    );
    await execa(
      "git",
      ["remote", "set-url", "--push", "origin", fetchUrls[0]],
      { cwd: ".buildpkg" }
    );
    for (let i = 1; i < pushUrls.length; i++) {
      await execa(
        "git",
        ["remote", "set-url", "--add", "--push", "origin", pushUrls[i]],
        { cwd: ".buildpkg" }
      );
    }
  }

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
