import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`TaskFlow API escuchando en http://localhost:${env.PORT}`);
  console.log(`Documentación disponible en http://localhost:${env.PORT}/api-docs`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
