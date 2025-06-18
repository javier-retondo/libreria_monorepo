import { Router } from 'express';
import {
  createOrderReq,
  getOrdersReq,
  updateOrderStatusReq,
} from './controller';
import { validationMiddleware } from '../../middlewares/classValidator';
import { CreateOrderDTO, OrdersListDTO, UpdateOrderDTO } from './dto';
import { checkUser } from '../../middlewares/checkUser';

const OrdersRouter = Router()
  .get(
    '/orders',
    checkUser,
    validationMiddleware(OrdersListDTO, 'query'),
    getOrdersReq,
  )
  .post(
    '/order',
    checkUser,
    validationMiddleware(CreateOrderDTO, 'body'),
    createOrderReq,
  )
  .put(
    '/order/:id/status',
    checkUser,
    validationMiddleware(UpdateOrderDTO, 'body'),
    updateOrderStatusReq,
  );

export default OrdersRouter;
