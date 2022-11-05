import express from 'express';
import loader from './loader/index';

async function startServer() {
  const app = express();
  await loader({ app });
}

startServer();
