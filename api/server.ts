/**
 * local server entry file, for local development
 */
import app from './app.js';
import { ensureSchema } from './db.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

await ensureSchema().catch((e) => {
  console.error('Database schema init failed:', e)
})

const server = app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
});

const cleanupTemp = async () => {
  try {
    const dir = path.join(process.cwd(), 'temp');
    const files = await fs.readdir(dir).catch(() => []);
    const now = Date.now();
    for (const f of files) {
      const p = path.join(dir, f);
      const stat = await fs.stat(p).catch(() => null);
      if (!stat) continue;
      if (now - stat.mtimeMs > 60 * 60 * 1000) {
        await fs.unlink(p).catch(() => {});
      }
    }
  } catch {
    return
  }
};

setInterval(cleanupTemp, 5 * 60 * 1000);

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
