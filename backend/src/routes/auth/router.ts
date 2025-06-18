import { Router } from 'express';
import {
  changePassword,
  loginUser,
  register,
  resetPassword,
} from './controller';
import { validationMiddleware } from '../../middlewares/classValidator';
import {
  ChangePasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from './dto';
import { checkUser } from '../../middlewares/checkUser';

const AuthRouter = Router()
  .post('/login', validationMiddleware(LoginDTO, 'body'), loginUser)
  .post('/register', validationMiddleware(RegisterDTO, 'body'), register)
  .post(
    '/reset-password',
    validationMiddleware(ResetPasswordDTO, 'body'),
    resetPassword,
  )
  .post(
    '/change-password',
    checkUser,
    validationMiddleware(ChangePasswordDTO, 'body'),
    changePassword,
  );

export default AuthRouter;
