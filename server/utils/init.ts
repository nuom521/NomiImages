import { initDatabase, isDatabaseConfigured } from './db';
import { syncDatabase } from './models';

export async function initializeApp() {
  if (isDatabaseConfigured()) {
    try {
      await initDatabase();
      await syncDatabase();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
}

