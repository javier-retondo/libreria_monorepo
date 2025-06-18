import { Request, Response } from 'express';
import { CreateOrderDTO, OrdersListDTO, UpdateOrderDTO } from './dto';
import { success, error } from '../../utils/network/responses';
import { IOrder, IUser, OrderStatus, UserRole } from '../../models';
import { createOrder, getOrders, updateStatus } from '../../services/Order';

export const getOrdersReq = async (req: Request, res: Response) => {
  const query: OrdersListDTO = req.body;
  const {
    page,
    pageSize,
    sortBy,
    sortOrder,
    estado,
    usuario_id,
    libro_id,
    date,
  } = query;
  const userData: IUser = req.body.userData;
  if (!userData || !userData.id) {
    return error({
      req,
      res,
      body: 'User data is required',
      status: 400,
    });
  }

  return await getOrders(
    {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      sortBy: (sortBy as keyof IOrder) || 'id',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'ASC',
    },
    estado,
    userData.rol === UserRole.ADMIN ? usuario_id : [userData.id],
    libro_id,
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

export const createOrderReq = async (req: Request, res: Response) => {
  const payload: CreateOrderDTO = req.body;
  const { items, orderData } = payload;
  const userData: IUser = req.body.userData;
  if (!userData || !userData.id) {
    return error({
      req,
      res,
      body: 'Los datos del usuario son requeridos',
      status: 400,
    });
  }
  if (userData.rol !== UserRole.USER) {
    return error({
      req,
      res,
      body: 'Solo los usuarios pueden crear pedidos',
      status: 403,
    });
  }

  return await createOrder(
    {
      ...orderData,
      usuario_id: userData.id,
      fecha: new Date(),
      estado: OrderStatus.PENDING,
    },
    items,
  )
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
        body: e.message || 'Error creating order',
        status: 500,
      });
    });
};

export const updateOrderStatusReq = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: UpdateOrderDTO = req.body;
  const { estado } = payload;
  const userData: IUser = req.body.userData;

  if (!userData || !userData.id) {
    return error({
      req,
      res,
      body: 'Los datos del usuario son requeridos',
      status: 400,
    });
  }

  if (userData.rol !== UserRole.ADMIN) {
    return error({
      req,
      res,
      body: 'Solo los administradores pueden actualizar el estado de los pedidos',
      status: 403,
    });
  }

  if (!id || !estado) {
    return error({
      req,
      res,
      body: 'Order ID and status are required',
      status: 400,
    });
  }
  return await updateStatus(Number(id), estado)
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
        body: e.message || 'Error updating order status',
        status: 500,
      });
    });
};
