import { Request, Response } from 'express';
import {
  ChangePasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from './dto';
import { login, resetUserPassword } from '../../services/Auth';
import { success, error } from '../../utils/network/responses';
import { IUser, UserRole } from '../../models';
import { createUser, getUserByEmail, updateUser } from '../../services/User';

export const loginUser = async (req: Request, res: Response) => {
  const payload: LoginDTO = req.body;
  const { email, password } = payload;
  return login(email, password)
    .then((body) => {
      success({
        req,
        res,
        body,
      });
    })
    .catch((e: Error) => {
      error({
        req,
        res,
        body: e.message || 'Login falló',
        status: 401,
      });
    });
};

export const register = async (req: Request, res: Response) => {
  const payload: RegisterDTO = req.body;
  const { email, name } = payload;
  return await createUser(name, email, UserRole.USER)
    .then((user: IUser) =>
      success({
        req,
        res,
        body: user,
      }),
    )
    .catch((e: Error) => {
      error({
        req,
        res,
        body: e.message || 'Error al crear el usuario',
        status: 500,
      });
    });
};

export const changePassword = async (req: Request, res: Response) => {
  const payload: ChangePasswordDTO = req.body;
  const userData: IUser = req.body.userData;
  if (!userData || !userData.id) {
    return error({
      req,
      res,
      body: 'Usuario no encontrado',
      status: 400,
    });
  }
  const { password } = payload;
  return await updateUser(userData.id, {
    password,
  })
    .then((user) => {
      if (user) {
        success({
          req,
          res,
          body: { message: 'Contraseña cambiada con éxito' },
        });
      } else {
        error({
          req,
          res,
          body: 'No se pudo cambiar la contraseña',
          status: 500,
        });
      }
    })
    .catch((e: Error) => {
      error({
        req,
        res,
        body: e.message || 'Error al cambiar la contraseña',
        status: 500,
      });
    });
};

export const resetPassword = async (req: Request, res: Response) => {
  const payload: ResetPasswordDTO = req.body;
  const { email } = payload;
  const user = await getUserByEmail(email, true);
  if (!user || !user.id) {
    return error({
      req,
      res,
      body: 'Usuario no encontrado',
      status: 400,
    });
  }
  return await resetUserPassword(user.id)
    .then((message: string) => {
      success({
        req,
        res,
        body: { message },
      });
    })
    .catch((e: Error) => {
      error({
        req,
        res,
        body: e.message || 'Error al restablecer la contraseña',
        status: 500,
      });
    });
};
