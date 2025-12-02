import { defineEventHandler, getRouterParam, createError, setHeader } from 'h3';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const imagePath = getRouterParam(event, 'path');
  if (!imagePath) {
    throw createError({
      statusCode: 404,
      message: 'Image not found',
    });
  }

  const filePath = path.join(process.cwd(), 'data', 'image', imagePath);
  
  if (!fs.existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      message: 'Image not found',
    });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };

  const mimeType = mimeTypes[ext] || 'image/jpeg';
  
  setHeader(event, 'Content-Type', mimeType);
  setHeader(event, 'Cache-Control', 'public, max-age=31536000');

  return fileBuffer;
});

