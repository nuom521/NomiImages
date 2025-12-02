import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

let sequelizeInstance: Sequelize | null = null;

export function initModels(sequelize: Sequelize) {
  sequelizeInstance = sequelize;
  
  // Initialize User model
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
      storageLimit: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
        comment: '存储空间限制（字节），null 表示无限制',
      },
    },
    {
      sequelize,
      tableName: 'users',
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  // Initialize Image model
  Image.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      filename: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      size: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      isGuest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'images',
    }
  );

  // Initialize Config model
  Config.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'configs',
    }
  );

  // Define associations
  User.hasMany(Image, { foreignKey: 'userId', as: 'images' });
  Image.belongsTo(User, { foreignKey: 'userId', as: 'user' });
}

// User Model
export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  storageLimit: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: 'admin' | 'user';
  declare storageLimit: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

// Image Model
export interface ImageAttributes {
  id: number;
  userId: number | null;
  filename: string;
  originalName: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
  isGuest: boolean;
  expiresAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Image extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
  declare id: number;
  declare userId: number | null;
  declare filename: string;
  declare originalName: string;
  declare path: string;
  declare url: string;
  declare size: number;
  declare mimeType: string;
  declare isGuest: boolean;
  declare expiresAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  
  // Association property (added by Sequelize when included)
  declare user?: User;
}

// Config Model
export interface ConfigAttributes {
  id: number;
  key: string;
  value: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConfigCreationAttributes extends Optional<ConfigAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Config extends Model<ConfigAttributes, ConfigCreationAttributes> implements ConfigAttributes {
  declare id: number;
  declare key: string;
  declare value: string;
  declare description: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export async function syncDatabase() {
  if (!sequelizeInstance) {
    throw new Error('Models not initialized');
  }
  
  // Check if tables exist before syncing to avoid MySQL index limit errors
  // Only create tables if they don't exist, don't alter existing tables
  try {
    // Check if users table exists
    const tableExists = await sequelizeInstance.getQueryInterface().tableExists('users');
    
    if (!tableExists) {
      // Only sync if tables don't exist (first time setup)
      await sequelizeInstance.sync();
    }
    // If tables exist, skip sync to avoid index limit issues
  } catch (error: any) {
    // If table check fails, try to sync (might be first time)
    if (error.message && error.message.includes('doesn\'t exist')) {
      await sequelizeInstance.sync();
    } else {
      throw error;
    }
  }
  
  // Initialize default configs
  const defaultConfigs = [
    { key: 'allow_guest_upload', value: 'true', description: '是否允许游客上传' },
    { key: 'guest_image_expire_days', value: '7', description: '游客图片保存时长(天，0为永久)' },
    { key: 'filename_format', value: '{timestamp}_{random}', description: '文件名存储格式' },
    { key: 'max_file_size', value: '10485760', description: '最大文件大小(字节)' },
    { key: 'allowed_mime_types', value: 'image/jpeg,image/png,image/gif,image/webp', description: '允许的MIME类型' },
  ];

  for (const config of defaultConfigs) {
    await Config.findOrCreate({
      where: { key: config.key },
      defaults: config,
    });
  }

  // Create default admin user if not exists
  const adminExists = await User.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
  }
}
