import { defineEventHandler, createError, getHeader } from 'h3';
import { Image } from '../../utils/models';
import { verifyToken } from '../../utils/auth';
import { initDatabase } from '../../utils/db';
import { ensureFullUrl } from '../../utils/image';

export default defineEventHandler(async (event) => {
  try {
    await initDatabase();
  } catch (error) {
    // Database might already be initialized
  }

  const authHeader = getHeader(event, 'authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token',
    });
  }

  const userId = payload.userId;
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const images = await Image.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });

  // 确保所有URL都是完整的
  const imagesWithFullUrl = await Promise.all(
    images.map(async (img) => ({
      id: img.id,
      url: await ensureFullUrl(img.url, event),
      filename: img.filename,
      originalName: img.originalName,
      size: img.size,
      createdAt: img.createdAt,
    }))
  );

  return {
    success: true,
    images: imagesWithFullUrl,
  };
});

