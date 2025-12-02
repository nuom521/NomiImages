import { defineEventHandler, readBody } from 'h3';
import { User } from '~~/server/utils/models';
import { Op } from 'sequelize';
import { initDatabase } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    await initDatabase();
  } catch (error) {
    // Database might already be initialized
  }
  try {
    const body = await readBody(event);
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return {
        success: false,
        message: '缺少必要参数',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: '密码长度至少6位',
      };
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: '用户名或邮箱已存在',
      };
    }

    const user = await User.create({
      username,
      email,
      password,
      role: 'user',
    });

    return {
      success: true,
      message: '注册成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '注册失败',
    };
  }
});

