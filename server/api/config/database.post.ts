import { defineEventHandler, readBody } from 'h3';
import { saveDatabaseConfig } from '~~/server/utils/config';
import { initDatabase } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { host, port, database, username, password } = body;

    if (!host || !database || !username || !password) {
      return {
        success: false,
        message: '缺少必要参数',
      };
    }

    const config = {
      host,
      port: port || 3306,
      database,
      username,
      password,
    };

    saveDatabaseConfig(config);
    
    // Test connection
    await initDatabase();
    await syncDatabase();

    return {
      success: true,
      message: '数据库配置成功',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '数据库配置失败',
    };
  }
});

