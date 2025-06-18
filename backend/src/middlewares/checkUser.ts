import { NextFunction, Request, Response } from 'express';
import { error } from '../utils/network/responses';
import jwt from 'jsonwebtoken';
import { getUserById } from '../services/User';
export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      error({
        req,
        res,
        status: 401,
        body: 'Falta token de autorización',
      });
      return;
    }
    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
    const decoded = jwt.verify(token, secretKey) as { id: string };
    if (!decoded || !decoded.id) {
      error({
        req,
        res,
        status: 401,
        body: 'Token inválido o expirado',
      });
      return;
    }
    const data = await getUserById(Number(decoded.id));
    if (!data) {
      error({
        req,
        res,
        status: 401,
        body: 'Usuario no encontrado',
      });
      return;
    }
    if (!req.body) req.body = {};
    req.body.userData = data;
    next();
  } catch (error) {
    console.error('Error in checkUser middleware:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
