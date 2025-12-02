import { defineEventHandler, readBody } from 'h3';
import { User } from '~~/server/utils/models';
import { generateToken } from '~~/server/utils/auth';
import { initDatabase } from '~~/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
    await initDatabase();
  } catch (error) {
    // Database might already be initialized
  }
  try {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
      return {
        success: false,
        message: '缺少必要参数',
      };
    }

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return {
        success: false,
        message: '用户名或密码错误',
      };
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return {
        success: false,
        message: '用户名或密码错误',
      };
    }

    const token = generateToken(user);

    return {
      success: true,
      message: '登录成功',
      token,
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
      message: error.message || '登录失败',
    };
  }
});

