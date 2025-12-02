import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { Config } from './models';
import type { EventHandlerRequest, H3Event } from 'h3';
import { getHeader } from 'h3';

export function ensureUserImageDir(userId: number): string {
  const imageDir = path.join(process.cwd(), 'data', 'image', userId.toString());
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  return imageDir;
}

export function ensureGuestImageDir(): string {
  const imageDir = path.join(process.cwd(), 'data', 'image', 'guest');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  return imageDir;
}

export async function generateFilename(originalName: string, userId?: number): Promise<string> {
  const config = await Config.findOne({ where: { key: 'filename_format' } });
  const format = config?.value || '{timestamp}_{random}';
  
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  
  let filename = format
    .replace(/{timestamp}/g, dayjs().format('YYYYMMDDHHmmss'))
    .replace(/{random}/g, uuidv4().substring(0, 8))
    .replace(/{original}/g, baseName)
    .replace(/{userid}/g, userId ? userId.toString() : 'guest')
    .replace(/{date}/g, dayjs().format('YYYY-MM-DD'))
    .replace(/{time}/g, dayjs().format('HH-mm-ss'));
  
  return filename + ext;
}

/**
 * 获取图片URL
 * @param filename 文件名
 * @param userId 用户ID（可选）
 * @param event H3事件对象（可选，用于获取请求头生成完整URL）
 * @returns 图片URL（相对路径或完整URL）
 */
export async function getImageUrl(filename: string, userId?: number, event?: H3Event<EventHandlerRequest>): Promise<string> {
  const userPath = userId ? userId.toString() : 'guest';
  const relativePath = `/api/image/${userPath}/${filename}`;
  
  // 如果提供了event，尝试生成完整URL
  if (event) {
    // 优先从配置中读取base_url
    const baseUrlConfig = await Config.findOne({ where: { key: 'base_url' } });
    if (baseUrlConfig?.value) {
      const baseUrl = baseUrlConfig.value.trim();
      // 确保baseUrl不以/结尾
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      return `${cleanBaseUrl}${relativePath}`;
    }
    
    // 如果没有配置，从请求头获取
    const host = getHeader(event, 'host');
    const protocol = getHeader(event, 'x-forwarded-proto') || 
                     (getHeader(event, 'x-forwarded-ssl') === 'on' ? 'https' : 'http');
    
    if (host) {
      return `${protocol}://${host}${relativePath}`;
    }
  }
  
  // 默认返回相对路径
  return relativePath;
}

/**
 * 确保URL是完整的（包含域名）
 * 如果URL已经是完整URL，则直接返回；如果是相对路径，则转换为完整URL
 * @param url 图片URL（可能是相对路径或完整URL）
 * @param event H3事件对象（可选，用于获取请求头生成完整URL）
 * @returns 完整URL
 */
export async function ensureFullUrl(url: string, event?: H3Event<EventHandlerRequest>): Promise<string> {
  // 如果已经是完整URL（以http://或https://开头），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是相对路径，需要转换为完整URL
  if (event) {
    // 优先从配置中读取base_url
    const baseUrlConfig = await Config.findOne({ where: { key: 'base_url' } });
    if (baseUrlConfig?.value) {
      const baseUrl = baseUrlConfig.value.trim();
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      return `${cleanBaseUrl}${url}`;
    }
    
    // 如果没有配置，从请求头获取
    const host = getHeader(event, 'host');
    const protocol = getHeader(event, 'x-forwarded-proto') || 
                     (getHeader(event, 'x-forwarded-ssl') === 'on' ? 'https' : 'http');
    
    if (host) {
      return `${protocol}://${host}${url}`;
    }
  }
  
  // 如果无法获取完整URL，返回原始URL
  return url;
}

