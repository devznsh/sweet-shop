import { app } from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🍬 Sweet Shop API running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
