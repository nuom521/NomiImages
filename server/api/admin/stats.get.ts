import { defineEventHandler, getHeader, createError } from 'h3';
import { User, Image  } from '~~/server/utils/models';
import { Op } from 'sequelize';
import { initDatabase } from '~~/server/utils/db';
import { verifyToken } from '~~/server/utils/auth';
import dayjs from 'dayjs';

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
  const totalUsers = await User.count();
  const totalImages = await Image.count();
  const guestImages = await Image.count({ where: { isGuest: true } });
  const userImages = await Image.count({ where: { isGuest: false } });
  
  const todayImages = await Image.count({
    where: {
      createdAt: {
        [Op.gte]: dayjs().startOf('day').toDate(),
      },
    },
  });

  const totalSize = await Image.sum('size') || 0;

  return {
    success: true,
    stats: {
      totalUsers,
      totalImages,
      guestImages,
      userImages,
      todayImages,
      totalSize,
    },
  };
});

