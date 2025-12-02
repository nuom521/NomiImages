import { defineEventHandler, readMultipartFormData, createError, getHeader } from 'h3';
import { Image, Config } from '../utils/models';
import { generateFilename, ensureUserImageDir, ensureGuestImageDir, getImageUrl } from '../utils/image';
import { verifyToken } from '../utils/auth';
import { initDatabase } from '../utils/db';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export default defineEventHandler(async (event) => {
  try {
    // Initialize database if needed
    try {
      await initDatabase();
    } catch (error) {
      // Database might already be initialized
    }

    // Check authentication (optional for guest uploads)
    const authHeader = getHeader(event, 'authorization');
    let userId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    // Check if guest upload is allowed
    const allowGuestConfig = await Config.findOne({ where: { key: 'allow_guest_upload' } });
    const allowGuest = allowGuestConfig?.value === 'true';
    
    if (!userId && !allowGuest) {
      throw createError({
        statusCode: 403,
        message: '游客上传已被禁用',
      });
    }

    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: '没有上传文件',
      });
    }

    const file = formData[0];
    if (!file || !file.data) {
      throw createError({
        statusCode: 400,
        message: '文件数据无效',
      });
    }

    // Check storage limit for authenticated users
    if (userId) {
      const { User } = await import('../utils/models');
      const user = await User.findByPk(userId);
      if (user && user.storageLimit !== null) {
        const usedStorage = await Image.sum('size', {
          where: { userId },
        }) || 0;
        
        const fileSize = file.data.length;
        if (Number(usedStorage) + fileSize > Number(user.storageLimit)) {
          throw createError({
            statusCode: 403,
            message: `存储空间不足。已使用: ${formatBytes(Number(usedStorage))}，限制: ${formatBytes(Number(user.storageLimit))}`,
          });
        }
      }
    }

    // Check file size
    const maxSizeConfig = await Config.findOne({ where: { key: 'max_file_size' } });
    const maxSize = parseInt(maxSizeConfig?.value || '10485760');
    if (file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        message: '文件大小超过限制',
      });
    }

    // Check MIME type
    const allowedTypesConfig = await Config.findOne({ where: { key: 'allowed_mime_types' } });
    const allowedTypes = (allowedTypesConfig?.value || 'image/jpeg,image/png,image/gif,image/webp').split(',');
    if (!allowedTypes.includes(file.type || '')) {
      throw createError({
        statusCode: 400,
        message: '不支持的文件类型',
      });
    }

    // Generate filename
    const filename = await generateFilename(file.filename || 'image', userId || undefined);
    
    // Save file
    const imageDir = userId ? ensureUserImageDir(userId) : ensureGuestImageDir();
    const filePath = path.join(imageDir, filename);
    fs.writeFileSync(filePath, file.data);

    // Calculate expiration date for guest images
    let expiresAt: Date | null = null;
    if (!userId) {
      const expireDaysConfig = await Config.findOne({ where: { key: 'guest_image_expire_days' } });
      const expireDays = parseInt(expireDaysConfig?.value || '7');
      if (expireDays > 0) {
        expiresAt = dayjs().add(expireDays, 'day').toDate();
      }
    }

    // Save to database
    const imageUrl = await getImageUrl(filename, userId || undefined, event);
    const image = await Image.create({
      userId,
      filename,
      originalName: file.filename || 'image',
      path: filePath,
      url: imageUrl,
      size: file.data.length,
      mimeType: file.type || 'image/jpeg',
      isGuest: !userId,
      expiresAt,
    });

    return {
      success: true,
      image: {
        id: image.id,
        url: image.url,
        filename: image.filename,
        originalName: image.originalName,
        size: image.size,
        createdAt: image.createdAt,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '上传失败',
    });
  }
});

