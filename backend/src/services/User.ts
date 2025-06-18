import bcrypt from 'bcrypt';
import ejs from 'ejs';
import { IUser, User, UserRole } from '../models';
import { join } from 'path';
import sendEmail from '../utils/mailer';
import { Op, WhereOptions } from 'sequelize';
import sequelize from '../database';

const createUser = async (
  nombre: string,
  email: string,
  rol: UserRole,
): Promise<IUser> => {
  const transaction = await sequelize.transaction();
  const password = Math.random().toString(36).slice(-8);
  const encryptedPassword = await bcrypt.hash(password, 10);
  const user = await User.create(
    {
      nombre,
      email,
      password: encryptedPassword,
      rol,
      pass_provisional: true,
    },
    { transaction },
  )
    .then((user) => {
      delete user.dataValues.password;
      return user.dataValues;
    })
    .catch(async (error) => {
      await transaction.rollback();
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    });

  console.log(
    `User created: ${user.nombre} (${user.email}) with role ${user.rol}`,
  );

  const html = await ejs.renderFile(join('templates', 'welcome.ejs'), {
    nombre: user.nombre,
    email: user.email,
    password: password,
  });

  return await sendEmail(user.email, 'Bienvenido a la plataforma', html)
    .then(async () => {
      await transaction.commit();
      delete user.password;
      return user;
    })
    .catch(async (error) => {
      console.error(`Error sending welcome email to ${user.email}:`, error);
      await transaction.rollback();
      throw new Error(`Error sending welcome email to ${user.email}`);
    });
};

const updateUser = async (
  id: number,
  data: Partial<IUser>,
): Promise<IUser | null> => {
  const user = await User.findByPk(id);
  if (!user) {
    console.error(`User with ID ${id} not found`);
    return null;
  }
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
    data.pass_provisional = false;
  }
  await user.update(data);
  delete user.dataValues.password;
  return user.dataValues;
};

const getUserByEmail = async (
  email: string,
  auth: boolean = false,
): Promise<IUser | null> => {
  const user = await User.findOne({
    where: auth
      ? {
          email: { [Op.eq]: email },
        }
      : { email: { [Op.like]: `%${email}%` } },
  });
  if (user) {
    if (!auth) delete user.dataValues.password;
    return user.dataValues;
  }
  return null;
};

const getUserById = async (id: number): Promise<IUser | null> => {
  const user = await User.findByPk(id);
  if (user) {
    delete user.dataValues.password;
    return user.dataValues;
  }
  return null;
};

const getUserModelById = async (
  id: number,
  auth: boolean = false,
): Promise<User | null> => {
  const user = await User.findByPk(id);
  if (user) {
    if (!auth) delete user.dataValues.password;
    return user;
  }
  return null;
};

const getAllUsers = async (
  pagination: {
    page: number;
    pageSize: number;
    sortBy: keyof IUser;
    sortOrder: 'ASC' | 'DESC';
  },
  search?: string,
  rol?: UserRole,
): Promise<{
  rows: IUser[];
  count: number;
}> => {
  const {
    page = 1,
    pageSize = 10000,
    sortBy = 'id',
    sortOrder = 'ASC',
  } = pagination;
  let where: WhereOptions<IUser> = [];
  if (search) {
    where = [
      { nombre: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }
  if (rol) {
    where.push({ rol });
  }
  const users = await User.findAndCountAll({
    where: where.length > 0 ? { [Op.or]: where } : undefined,
    order: [[sortBy, sortOrder]],
    offset: (page - 1) * pageSize,
    limit: pageSize,
  })
    .then((users) => {
      return {
        rows: users.rows.map((user) => {
          const userData = user.dataValues;
          delete userData.password;
          return userData;
        }),
        count: users.count,
      };
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      throw new Error('Error fetching users');
    });

  return users;
};

const deleteUser = async (id: number): Promise<void> => {
  const user = await User.findByPk(id);
  if (!user) {
    console.error(`User with ID ${id} not found`);
    throw new Error(`User with ID ${id} not found`);
  }
  await user.destroy();
  console.log(`User with ID ${id} deleted successfully`);
};

export {
  createUser,
  updateUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  deleteUser,
  getUserModelById,
};
