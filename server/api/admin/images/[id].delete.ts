import { defineEventHandler, getRouterParam, getHeader, createError } from 'h3';
import { Image } from '~~/server/utils/models';
import { initDatabase } from '~~/server/utils/db';
import { verifyToken } from '~~/server/utils/auth';
import fs from 'fs';

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
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少图片ID',
    });
  }

  const image = await Image.findByPk(id);
  if (!image) {
    throw createError({
      statusCode: 404,
      message: '图片不存在',
    });
  }

  // Delete file
  if (fs.existsSync(image.path)) {
    fs.unlinkSync(image.path);
  }

  // Delete from database
  await image.destroy();

  return {
    success: true,
    message: '删除成功',
  };
});

