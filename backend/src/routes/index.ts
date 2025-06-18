import { Router } from 'express';
import AuthRouter from './auth/router';
import BookRouter from './books/router';
import UserRouter from './users/router';
import OrdersRouter from './orders/router';

export const Routes: [string, Router][] = [
  ['/auth', AuthRouter],
  ['/books', BookRouter],
  ['/users', UserRouter],
  ['/orders', OrdersRouter],
];
