# next-dashboard monorepo

This monorepo uses lerna and yarn workspaces. In order to get it working with git-dependencies there are some magic commands that can be useful to know.

## `yarn bootstrap`

This command bootstraps the project, connects relevant local dependencies of all packages in the `packages`, ignoring the version string using magic.js.

## `yarn magic`

Run a yarn command, but wrap it in magic.

Works like regular `yarn`, but ensures all package.json files are compatible with yarn workspaces first. Using magic.js

## Why magic?

Because, in order to depend on a git dependency, like in a potential subproject, the package.json dependency needs to be in one configuration.

In order to use yarn workspaces, the package.json dependency needs to be in another configuration. Since we want to commit packages using whatever dependency version is specified in the package.json originally,

but still be able to connect things up, I made magic. It temporarily modifies the package.json file during the course a yarn command is run, and then restores the previously specified version, even if the package.json file
changed during the course of the run.

You can do things like `yarn magic workspace secret-<package_name> add <new dependency>` for instance, to add new packages, or just run `yarn add <new dependency>` in the packages own directory, and then rerun `yarn bootstrap` in the root project.