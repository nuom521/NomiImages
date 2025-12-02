import fs from 'fs';
import path from 'path';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export function saveDatabaseConfig(config: DatabaseConfig): void {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const configPath = path.join(dataDir, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function getDatabaseConfig(): DatabaseConfig | null {
  const configPath = path.join(process.cwd(), 'data', 'config.json');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

