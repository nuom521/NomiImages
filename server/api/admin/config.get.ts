import { defineEventHandler, getHeader, createError } from 'h3';
import { Config } from '~~/server/utils/models';
import { initDatabase } from '~~/server/utils/db';
import { verifyToken } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  try {
    await initDatabase();
  } catch (error) {
    // Database might already be initialized
  }

  // Check authentication
  const authHeader = getHeader(event, 'authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: Admin access required',
    });
  }

  const configs = await Config.findAll({
    order: [['key', 'ASC']],
  });

  return {
    success: true,
    configs: configs.map(c => ({
      key: c.key,
      value: c.value,
      description: c.description,
    })),
  };
});

