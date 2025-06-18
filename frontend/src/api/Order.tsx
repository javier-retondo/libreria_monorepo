import api from '.';
import type { Order } from '../types/Entities';

export const createOrder = async (
  items: { libro_id: number; cantidad: number; precio: number }[],
  orderData: { provincia: string; direccion: string; detalles?: string },
) => {
  return await api.post('/orders/order', { items, orderData });
};

export const getOrders = async (
  pagination: {
    page: number;
    pageSize: number;
    sortBy: keyof Order;
    sortOrder: 'ASC' | 'DESC';
  },
  filters: {
    estado?: 'pendiente' | 'completado' | 'cancelado';
    usuario_id?: number | number[];
    libro_id?: number | number[];
    date?: Date;
  },
): Promise<{
  rows: Order[];
  pagination: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    totalPages: number;
    previousPage: number | null;
    nextPage: number | null;
  };
}> => {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'id',
    sortOrder = 'ASC',
  } = pagination;
  const { usuario_id, libro_id, estado } = filters;
  return await api.get('/orders/orders', {
    params: {
      page,
      pageSize,
      sortBy,
      sortOrder,
      estado,
      usuario_id: Array.isArray(usuario_id) ? usuario_id.join(',') : usuario_id,
      libro_id: Array.isArray(libro_id) ? libro_id.join(',') : libro_id,
      date: filters.date,
    },
  });
};

export const updateOrderStatus = async (
  id: number,
  estado: 'completado' | 'cancelado',
) => {
  return await api.put(`/orders/order/${id}/status`, { estado });
};
