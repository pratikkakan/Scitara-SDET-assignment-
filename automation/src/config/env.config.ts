type Env = 'local' | 'staging' | 'production';

interface EnvConfig {
  apiBaseUrl: string;
  uiBaseUrl: string;
  wsUrl: string;
}

const envConfigs: Record<Env, EnvConfig> = {
  local: {
    apiBaseUrl: 'http://localhost:3000',
    uiBaseUrl: 'http://localhost:5173',
    wsUrl: 'ws://localhost:3001',
  },
  staging: {
    apiBaseUrl: 'https://api.staging.example.com',
    uiBaseUrl: 'https://staging.example.com',
    wsUrl: 'wss://ws.staging.example.com',
  },
  production: {
    apiBaseUrl: 'https://api.example.com',
    uiBaseUrl: 'https://example.com',
    wsUrl: 'wss://ws.example.com',
  },
};

const currentEnv = (process.env.TEST_ENV as Env) ?? 'local';

export const config: EnvConfig = envConfigs[currentEnv];
export const apiHeaders = { 'Content-Type': 'application/json' };
