import { defineEventHandler } from 'h3';
import { isDatabaseConfigured } from '../../utils/db';

export default defineEventHandler(async (event) => {
  return {
    configured: isDatabaseConfigured(),
  };
});

