import api from '.';
import type { User } from '../types/Entities';

export const getUsers = async (
  pagination: {
    page: number;
    pageSize: number;
    sortBy: keyof User;
    sortOrder: 'ASC' | 'DESC';
  },
  filters: {
    search?: string;
    rol?: 'administrador' | 'usuario';
  },
): Promise<{
  rows: User[];
  pagination: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    totalPages: number;
    previousPage: number | null;
    nextPage: number | null;
  };
}> => {
  return await api.get('/users/users', {
    params: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      search: filters.search,
      rol: filters.rol,
    },
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  return await api.delete(`/users/user/${id}`);
};
