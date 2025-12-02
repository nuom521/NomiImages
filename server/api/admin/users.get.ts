import { defineEventHandler, getQuery, getHeader, createError } from 'h3';
import { User, Image } from '~~/server/utils/models';
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
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: { exclude: ['password'] },
  });

  // Calculate used storage for each user
  const usersWithStorage = await Promise.all(
    rows.map(async (user) => {
      const usedStorage = await Image.sum('size', {
        where: { userId: user.id },
      }) || 0;

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        storageLimit: user.storageLimit ? Number(user.storageLimit) : null,
        usedStorage: Number(usedStorage),
        createdAt: user.createdAt,
      };
    })
  );

  return {
    success: true,
    users: usersWithStorage,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit),
    },
  };
});

