import express from 'express';
import loader from './loader/index.js';

async function startServer() {
  const app = express();
  await loader({ app });
}

startServer();
