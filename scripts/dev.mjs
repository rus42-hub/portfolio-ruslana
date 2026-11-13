import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, closeSync } from 'node:fs';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const database = path.resolve(root, '..', 'Base-de-donnees-Portfolio');
const baseURL = 'http://127.0.0.1:8097';

async function available(port) {
  await new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', () => reject(new Error(`Port ${port} is occupied. No running project was stopped. Use its existing tab or free this port manually.`)));
    server.listen(port, '127.0.0.1', () => server.close(resolve));
  });
}

async function databaseReady() {
  let response;
  try { response = await fetch(`${baseURL}/api/collections/projects/records?perPage=1`, { signal: AbortSignal.timeout(1500) }); }
  catch { return false; }
  const data = await response.json();
  if (!response.ok || !Array.isArray(data.items) || data.items.some(item => !('title_fr' in item && 'home_rank' in item))) throw new Error('Port 8097 serves a different database. Nothing was changed.');
  return true;
}

try {
  await available(4330);
  if (!await databaseReady()) {
    await available(8097);
    const executable = path.join(database, 'pocketbase.exe');
    if (!existsSync(executable) || !existsSync(path.join(database, 'pb_data', 'data.db'))) throw new Error(`Existing portfolio database not found in ${database}. No empty database was created.`);
    mkdirSync(path.join(root, '.local'), { recursive: true });
    const log = openSync(path.join(root, '.local', 'pocketbase.log'), 'a');
    const child = spawn(executable, ['serve', '--http=127.0.0.1:8097'], { cwd: database, windowsHide: true, detached: true, stdio: ['ignore', log, log] });
    child.on('error', error => console.error(`PocketBase: ${error.message}`));
    child.unref();
    closeSync(log);
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      if (await databaseReady()) { ready = true; break; }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    if (!ready) throw new Error('PocketBase did not start. See .local/pocketbase.log.');
  }
  console.log(`Portfolio: http://127.0.0.1:4330/ | PocketBase: ${baseURL}/_/`);
  const site = spawn(process.execPath, [path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'dev'], { cwd: root, stdio: 'inherit', windowsHide: true, env: { ...process.env, PUBLIC_POCKETBASE_URL: baseURL } });
  site.on('error', error => { console.error(error.message); process.exitCode = 1; });
  site.on('exit', code => { process.exitCode = code || 0; });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
