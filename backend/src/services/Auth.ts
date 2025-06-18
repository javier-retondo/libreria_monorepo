import bcrypt from 'bcrypt';
import { getUserByEmail, getUserModelById } from './User';
import jwt from 'jsonwebtoken';
import { join } from 'path';
import ejs from 'ejs';
import sendEmail from '../utils/mailer';
import { IUser } from '../models';

export const login = async (
  email: string,
  password: string,
): Promise<{
  user: IUser;
  token: string;
}> => {
  const user = await getUserByEmail(email, true);
  if (!user || !user.password) {
    throw new Error('Usuario no encontrado');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales incorrectas');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '24h',
  });

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      pass_provisional: user.pass_provisional,
    },
    token,
  };
};

export const resetUserPassword = async (id: number): Promise<string> => {
  const user = await getUserModelById(id, true);
  if (!user || !user.dataValues.password) {
    throw new Error('Usuario no encontrado');
  }

  const newPassword = Math.random().toString(36).slice(-8);
  const encryptedPassword = await bcrypt.hash(newPassword, 10);
  await user.update({
    password: encryptedPassword,
    pass_provisional: true,
  });
  delete user.dataValues.password;

  const html = await ejs.renderFile(join('templates', 'welcome.ejs'), {
    nombre: user.dataValues.nombre,
    email: user.dataValues.email,
    password: newPassword,
  });

  await sendEmail(user.dataValues.email, 'Bienvenido a la plataforma', html);

  return `Contraseña del usuario ${user.dataValues.nombre} con Id: ${user.dataValues.id} restablecida y enviada a ${user.dataValues.email}`;
};
