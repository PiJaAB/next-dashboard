const yaml = require('js-yaml');
const fs = require('fs');

const document = yaml.load(fs.readFileSync('./pnpm-lock.yaml', 'utf-8'));
document.importers = Object.fromEntries(Object.entries(document.importers).filter(([k]) => !k.startsWith('Projects/')));
document.packages = Object.fromEntries(Object.entries(document.packages).filter(([,v]) => !v.$DEFUNCT_PROPERTY));
fs.writeFileSync('./pnpm-lock.yaml', yaml.dump(document));