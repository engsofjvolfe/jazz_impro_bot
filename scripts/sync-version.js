// scripts/sync-version.js
const fs = require('fs');
const path = require('path');

const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
const packageJsonPath = path.join(__dirname, '..', 'package.json');

const changelog = fs.readFileSync(changelogPath, 'utf8');
const versionMatch = changelog.match(/^## \[(\d+\.\d+\.\d+)]/m);

if (!versionMatch) {
  console.error('❌ Não foi possível encontrar a versão no CHANGELOG.md');
  process.exit(1);
}

const newVersion = versionMatch[1];
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (packageJson.version !== newVersion) {
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`🔄 package.json version atualizado para ${newVersion}`);
} else {
  console.log('✅ Versão já está sincronizada.');
}
