import { defineEventHandler, readBody, getHeader, createError } from 'h3';
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

  const body = await readBody(event);
  const { configs } = body;

  if (!Array.isArray(configs)) {
    return {
      success: false,
      message: '无效的配置数据',
    };
  }

  for (const item of configs) {
    await Config.update(
      { value: item.value },
      { where: { key: item.key } }
    );
  }

  return {
    success: true,
    message: '配置更新成功',
  };
});

