import { app } from './app.js';

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () =>
{
  console.log(`VorratsCheck API läuft auf http://localhost:${PORT}`);
});
