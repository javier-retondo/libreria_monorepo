import { Router } from 'express';
import { deleteUserReq, getUsersReq } from './controller';
import { validationMiddleware } from '../../middlewares/classValidator';
import { UserListDTO } from './dto';
import { checkUser } from '../../middlewares/checkUser';

const UserRouter = Router()
  .get('/users', validationMiddleware(UserListDTO, 'query'), getUsersReq)
  .delete('/user/:id', checkUser, deleteUserReq);

export default UserRouter;
