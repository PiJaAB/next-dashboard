const fs = require('fs');

const path = require('path');
const { spawnSync } = require('child_process');

const [,,...args] = process.argv;

const PACKAGES_DIR = 'packages';

const DEPENDENCY_KEYS = ['dependencies', 'devDependencies'];

const NAMESPACE = '@pija-ab';

const PACKAGES = ['next-dashboard'];

const FULL_PACKAGES = PACKAGES.map(p => `${NAMESPACE}${NAMESPACE ? '/' : ''}${p}`)

const packages = [];

const VERSION = require('./lerna').version;

function dependsOnPackage(pkgs) {
  if (typeof pkgs === 'object') pkgs = Object.keys(pkgs);
  return pkgs.some(p => FULL_PACKAGES.includes(p));
}

for (const entry of fs.readdirSync(PACKAGES_DIR, {withFileTypes: true})) {
   if(!entry.isDirectory()) continue;
   try {
    const content = fs.readdirSync(path.join(PACKAGES_DIR, entry.name), {withFileTypes: true});
    if (content.find(e => e.name === 'package.json')) {
      try {
        fs.accessSync(path.join(PACKAGES_DIR, entry.name, 'package.json'), fs.constants.R_OK | fs.constants.W_OK)
        const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGES_DIR, entry.name, 'package.json'), { encoding: 'utf8' }));
        if (typeof pkg !== 'object' && pkg != null) throw new TypeError(`Expected root object in package.json, got ${pkg === null ? 'null' : typeof pkg}`);
        for (const depKey of DEPENDENCY_KEYS) {
          if (typeof pkg[depKey] !== 'object') continue;
          if (dependsOnPackage(pkg[depKey])) {
            packages.push({
              path: path.join(PACKAGES_DIR, entry.name, 'package.json'),
              org: pkg,
            });
            continue;
          }
        }
      } catch (err) {
        console.error(`Can't read and/or write to package.json in package ${entry.name}`, err);
      }
    }
   } catch (err) {
    console.error(`Failed to read directory '${entry.name}'`, err)
   }
}

function patchPkg(pkg) {
  const newPkg = { ...pkg };
  for (const key of DEPENDENCY_KEYS) {
    if (newPkg[key] && typeof newPkg[key] === 'object') {
      if (!dependsOnPackage(newPkg[key])) continue;
      newPkg[key] = { ...newPkg[key] };
      const toPatch = Object.keys(newPkg[key]).filter(p => FULL_PACKAGES.includes(p));
      toPatch.forEach(k=>{newPkg[key][k] = `^${VERSION}`})
    }
  }
  return newPkg;
}

function restorePkg(mew, org) {
  for (const key of DEPENDENCY_KEYS) {
    if (mew[key] && typeof mew[key] === 'object') {
      if (!dependsOnPackage(mew[key])) continue;
      mew[key] = { ...mew[key] };
      const toPatch = Object.keys(mew[key]).filter(p => FULL_PACKAGES.includes(p));
      toPatch.forEach(k=>{mew[key][k] = org[key][k]})
    }
  }
  return mew;
}

packages.forEach(pkg => {
  fs.writeFileSync(pkg.path, `${JSON.stringify(patchPkg(pkg.org), null, 2)}\n`)
});

spawnSync('yarn', args, { stdio: 'inherit', shell: true });

packages.forEach(pkg => {
  const newPkg = JSON.parse(fs.readFileSync(pkg.path, { encoding: 'utf8' }));
  fs.writeFileSync(pkg.path, `${JSON.stringify(restorePkg(newPkg, pkg.org), null, 2)}\n`)
});
