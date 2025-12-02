import { defineEventHandler, getQuery, getHeader, createError } from 'h3';
import { Image } from '~~/server/utils/models';
import { initDatabase } from '~~/server/utils/db';
import { verifyToken } from '~~/server/utils/auth';
import { ensureFullUrl } from '~~/server/utils/image';

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
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await Image.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{
      association: 'user',
      attributes: ['id', 'username', 'email'],
      required: false,
    }],
  });

  // 确保所有URL都是完整的
  const imagesWithFullUrl = await Promise.all(
    rows.map(async (img) => ({
      id: img.id,
      url: await ensureFullUrl(img.url, event),
      filename: img.filename,
      originalName: img.originalName,
      size: img.size,
      isGuest: img.isGuest,
      expiresAt: img.expiresAt,
      createdAt: img.createdAt,
      user: img.user ? {
        id: img.user.id,
        username: img.user.username,
        email: img.user.email,
      } : null,
    }))
  );

  return {
    success: true,
    images: imagesWithFullUrl,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit),
    },
  };
});

