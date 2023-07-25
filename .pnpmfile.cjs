const { formatWithOptions } = require("node:util");

function makeLogger(context) {
  return function logger(...args) {
    context.log(formatWithOptions({ colors: true }, ...args));
  };
}

function afterAllResolved(lockfile, context) {
  const log = makeLogger(context);
  const projectDependencies = new Set();
  const libDependencies = new Set();
  Object.entries(lockfile.importers).forEach(([k, v]) => {
    function addLibDependency([name, version]) {
      if (
        lockfile.packages[version] &&
        lockfile.packages[version].name === name
      ) {
        projectDependencies.delete(version);
        libDependencies.add(version);
      }
      if (lockfile.packages[`/${name}/${version}`]) {
        projectDependencies.delete(`/${name}/${version}`);
        libDependencies.add(`/${name}/${version}`);
      }
    }
    function addProjectDependency([name, version]) {
      if (
        lockfile.packages[version] &&
        lockfile.packages[version].name === name &&
        !libDependencies.has(version)
      ) {
        projectDependencies.add(version);
      }

      if (
        lockfile.packages[`/${name}/${version}`] &&
        !libDependencies.has(`/${name}/${version}`)
      ) {
        projectDependencies.add(`/${name}/${version}`);
      }
    }
    if (k.startsWith("Projects/")) {
      Object.entries(v.dependencies).forEach(addProjectDependency);
      Object.entries(v.devDependencies).forEach(addProjectDependency);
      Object.entries(v.optionalDependencies).forEach(addProjectDependency);
    } else {
      Object.entries(v.dependencies).forEach(addLibDependency);
      Object.entries(v.devDependencies).forEach(addLibDependency);
      Object.entries(v.optionalDependencies).forEach(addLibDependency);
    }
  });
  const newLockfile = {
    ...lockfile,
  };
  projectDependencies.forEach((version) => {
    newLockfile.packages[version] = {
      ...newLockfile.packages[version],
      $DEFUNCT_PROPERTY: true,
    };
  });
  return newLockfile;
}

module.exports = {
  hooks: {
    afterAllResolved,
  },
};
