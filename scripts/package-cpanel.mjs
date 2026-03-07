import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const phpApiDir = path.join(rootDir, 'public_html', 'api');
const privateDir = path.join(rootDir, 'private');
const openApiSpecSource = path.join(rootDir, 'docs', 'CUSTOM_GPT_MANAGEMENT_ACTIONS_OPENAPI.yaml');

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ does not exist. Run `npm run build` first.');
}

if (!fs.existsSync(phpApiDir) || !fs.existsSync(privateDir)) {
  throw new Error('Required PHP deployment directories are missing.');
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, '')
  .replace(/\..+/, '')
  .replace('T', '-');

const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ultraction-cpanel-'));
const publicStageDir = path.join(stageDir, 'public_html');
const apiStageDir = path.join(publicStageDir, 'api');
const latestZip = path.join(rootDir, 'ultraction-cpanel-static-latest.zip');
const versionedZip = path.join(rootDir, `ultraction-cpanel-static-${timestamp}.zip`);

fs.cpSync(distDir, publicStageDir, { recursive: true });
fs.rmSync(path.join(publicStageDir, 'api'), { recursive: true, force: true });
fs.mkdirSync(apiStageDir, { recursive: true });

fs.cpSync(phpApiDir, apiStageDir, { recursive: true });

const dotEnv = path.join(rootDir, '.env');
const dotEnvLocal = path.join(rootDir, '.env.local');
if (fs.existsSync(dotEnv)) {
  fs.copyFileSync(dotEnv, path.join(stageDir, '.env'));
}
if (fs.existsSync(dotEnvLocal)) {
  fs.copyFileSync(dotEnvLocal, path.join(stageDir, '.env.local'));
}

if (fs.existsSync(openApiSpecSource)) {
  fs.copyFileSync(openApiSpecSource, path.join(apiStageDir, 'openapi.yaml'));
}

fs.cpSync(privateDir, path.join(stageDir, 'private'), { recursive: true });

for (const target of [latestZip, versionedZip]) {
  fs.rmSync(target, { force: true });
}

const pythonZipScript = [
  'import os, sys, zipfile',
  'root, dest = sys.argv[1], sys.argv[2]',
  'with zipfile.ZipFile(dest, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:',
  '    for folder in ("public_html", "private"):',
  '        folder_path = os.path.join(root, folder)',
  '        for current_root, _, files in os.walk(folder_path):',
  '            for name in files:',
  '                full_path = os.path.join(current_root, name)',
  '                arcname = os.path.relpath(full_path, root)',
  '                zf.write(full_path, arcname)',
].join('\n');

const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
execFileSync(pythonCmd, ['-c', pythonZipScript, stageDir, versionedZip], { stdio: 'inherit' });
fs.copyFileSync(versionedZip, latestZip);

console.log(JSON.stringify({
  versionedZip,
  latestZip,
}, null, 2));
