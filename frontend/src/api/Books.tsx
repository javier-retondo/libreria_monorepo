import api from '.';
import type { Author, Book, Category } from '../types/Entities';

export const getLibros = async (
  pagination: {
    page: number;
    pageSize: number;
    sortBy: keyof Book;
    sortOrder: 'ASC' | 'DESC';
  },
  filters: {
    search?: string;
    precio_desde?: number;
    precio_hasta?: number;
    autor_id?: number[];
    categorias?: number[];
  },
): Promise<{
  rows: Book[];
  pagination: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    totalPages: number;
    previousPage: number | null;
    nextPage: number | null;
  };
}> => {
  return await api.get('/books/books', {
    params: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      search: filters.search,
      precio_desde: filters.precio_desde,
      precio_hasta: filters.precio_hasta,
      autor_id: filters.autor_id?.join(','),
      categorias_id: filters.categorias?.join(','),
    },
  });
};
export const getAutores = async (): Promise<Author[]> => {
  return await api.get('/books/authors');
};
export const getCategorias = async (): Promise<Category[]> => {
  return await api.get('/books/categories');
};
export const createLibro = async (formData: FormData) => {
  return api.post('/books/book', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const createAuthor = async (
  authorData: Omit<Author, 'id'>,
): Promise<Author> => {
  return await api.post('/books/author', authorData);
};
export const createCategory = async (
  categoryData: Omit<Category, 'id'>,
): Promise<Category> => {
  return await api.post('/books/category', categoryData);
};
export const deleteAuthor = async (id: number) => {
  return await api.delete(`/books/author/${id}`);
};
export const deleteCategory = async (id: number) => {
  return await api.delete(`/books/category/${id}`);
};
export const deleteLibro = async (id: number) => {
  return await api.delete(`/books/book/${id}`);
};
export const updateLibro = async (id: number, formData: FormData) => {
  return api.put(`/books/book/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
