import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function localJsonDbPlugin(): Plugin {
  const dbDir = path.resolve(__dirname, 'src/data/db');
  const allowedTabs = new Set(['acervo', 'lidos', 'para_ler', 'para_comprar']);
  let lastInternalWriteAt = 0;

  return {
    name: 'acerbook-local-json-db',
    apply: 'serve',
    handleHotUpdate({ file }) {
      const normalized = file.replace(/\\/g, '/');
      if (
        normalized.includes('/src/data/db/') &&
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
            const parsed = JSON.parse(body) as {
              tab?: string;
              content?: string;
            };

            if (
              !parsed.tab ||
              !allowedTabs.has(parsed.tab) ||
              typeof parsed.content !== 'string'
            ) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Payload inválido.' }));
              return;
            }

            // Garante que é um JSON válido antes de gravar no disco
            JSON.parse(parsed.content);

            const targetFile = path.join(dbDir, `${parsed.tab}.json`);
            lastInternalWriteAt = Date.now();
            fs.writeFileSync(targetFile, `${parsed.content}\n`, 'utf-8');

            const normalizedTarget = targetFile.replace(/\\/g, '/');
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
            res.end(JSON.stringify({ ok: true, file: `${parsed.tab}.json` }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: false,
                error:
                  err instanceof Error
                    ? err.message
                    : 'Erro ao gravar arquivo JSON no disco.',
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