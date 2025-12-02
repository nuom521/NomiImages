import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { initModels } from './models';

let sequelize: Sequelize | null = null;

export async function initDatabase(): Promise<Sequelize> {
  if (sequelize) {
    return sequelize;
  }
  
  const configPath = path.join(process.cwd(), 'data', 'config.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error('Database not configured');
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );

  try {
    await sequelize.authenticate();
    initModels(sequelize);
    return sequelize;
  } catch (error) {
    throw error;
  }
}

export function getDatabase(): Sequelize {
  if (!sequelize) {
    throw new Error('Database not initialized');
  }
  return sequelize;
}

export function isDatabaseConfigured(): boolean {
  const configPath = path.join(process.cwd(), 'data', 'config.json');
  return fs.existsSync(configPath);
}

