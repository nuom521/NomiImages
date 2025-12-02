import { defineEventHandler, getRouterParam, readBody, getHeader, createError } from 'h3';
import { User } from '~~/server/utils/models';
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

  const userId = parseInt(getRouterParam(event, 'id') || '0');
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID',
    });
  }

  const body = await readBody(event);
  const { storageLimit } = body;

  if (storageLimit !== null && storageLimit !== undefined) {
    if (typeof storageLimit !== 'number' || storageLimit < 0) {
      throw createError({
        statusCode: 400,
        message: 'Invalid storage limit. Must be a non-negative number or null',
      });
    }
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  user.storageLimit = storageLimit === null || storageLimit === undefined ? null : BigInt(storageLimit);
  await user.save();

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      storageLimit: user.storageLimit ? Number(user.storageLimit) : null,
      createdAt: user.createdAt,
    },
  };
});

