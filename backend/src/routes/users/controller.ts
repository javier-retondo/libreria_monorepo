import { Request, Response } from 'express';
import { UserListDTO } from './dto';
import { success, error } from '../../utils/network/responses';
import { IUser, UserRole } from '../../models';
import { deleteUser, getAllUsers } from '../../services/User';

export const getUsersReq = async (req: Request, res: Response) => {
  const query: UserListDTO = req.body;
  const { page, pageSize, sortBy, sortOrder, search, rol } = query;

  return await getAllUsers(
    {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      sortBy: (sortBy as keyof IUser) || 'id',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'ASC',
    },
    search,
    rol,
  )
    .then((body) => {
      let pagination = {
        page: 1,
        limit: body.count,
        total: body.count,
      };
      if (page && pageSize) {
        pagination = {
          page: Number(page),
          limit: Number(pageSize),
          total: body.count,
        };
      }
      success({ req, res, body: body.rows, pagination });
    })
    .catch((err) => {
      console.error('Error fetching books:', err);
      return error({
        req,
        res,
        body: 'Failed to fetch books',
        status: 500,
      });
    });
};

export const deleteUserReq = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    return error({
      req,
      res,
      body: 'Invalid user ID',
      status: 400,
    });
  }
  return await deleteUser(userId)
    .then(() => {
      return success({
        req,
        res,
        body: 'User deleted successfully',
        status: 200,
      });
    })
    .catch((err) => {
      console.error('Error deleting user:', err);
      return error({
        req,
        res,
        body: 'Failed to delete user',
        status: 500,
      });
    });
};
