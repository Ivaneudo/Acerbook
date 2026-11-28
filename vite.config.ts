
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localJsonDbPlugin(): Plugin {
  const dbFile = path.resolve(__dirname, 'src/data/db/biblioteca.json');
  let lastInternalWriteAt = 0;

  return {
    name: 'acerbook-local-json-db',
    apply: 'serve',
    handleHotUpdate({ file }) {
      const normalized = file.replace(/\\/g, '/');
      if (
        normalized.endsWith('/src/data/db/biblioteca.json') &&
        Date.now() - lastInternalWriteAt < 2000
      ) {
        return [];
      }
    },
    configureServer(server) {
      server.middlewares.use('/__acerbook_db', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Método não permitido.' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const parsed = JSON.parse(body) as { content?: string };
            if (typeof parsed.content !== 'string') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Payload inválido.' }));
              return;
            }

            JSON.parse(parsed.content);

            lastInternalWriteAt = Date.now();
            fs.writeFileSync(dbFile, `${parsed.content}\n`, 'utf-8');

            const normalizedTarget = dbFile.replace(/\\/g, '/');
            const modules = server.moduleGraph.getModulesByFile(normalizedTarget);
            if (modules) {
              modules.forEach((mod) => server.moduleGraph.invalidateModule(mod));
            } else {
              const mod = server.moduleGraph.getModuleById(normalizedTarget);
              if (mod) {
                server.moduleGraph.invalidateModule(mod);
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, file: 'biblioteca.json' }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: false,
                error:
                  err instanceof Error
                    ? err.message
                    : 'Erro ao gravar biblioteca.json no disco.',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    localJsonDbPlugin(),
  ],
});