import { Request, Response } from 'express';
import {
  AuthorCreateDTO,
  BookCreateDTO,
  BooksListDTO,
  CategoryCreateDTO,
} from './dto';
import { success, error } from '../../utils/network/responses';
import { IBook, IUser, UserRole } from '../../models';
import { createBook, deleteBook, getBooks } from '../../services/Book';
import { createAuthor, deleteAuthor, getAuthors } from '../../services/Author';
import {
  createCategory,
  deleteCategory,
  getCategories,
} from '../../services/Category';
import sequelize from '../../database';

export const createBookReq = async (req: Request, res: Response) => {
  const bookData: BookCreateDTO = req.body;
  const { titulo, descripcion, imagen_url, autor_id, categorias_id } = bookData;
  const user: IUser = req.body.userData;
  if (user.rol !== UserRole.ADMIN) {
    return error({
      req,
      res,
      body: 'Unauthorized: Only admins can create books',
      status: 403,
    });
  }
  const transaction = await sequelize.transaction();
  return await createBook(
    {
      titulo,
      descripcion,
      precio: bookData.precio,
      imagen_url,
      autor_id,
    },
    categorias_id,
    transaction,
  )
    .then(async (book) => {
      if (!book) {
        await transaction.rollback();
        return error({
          req,
          res,
          body: 'Failed to create book',
          status: 500,
        });
      }
      await transaction.commit();
      return success({
        req,
        res,
        body: book,
        status: 201,
      });
    })
    .catch(async (err) => {
      console.error('Error creating book:', err);
      if (transaction) {
        await transaction.rollback();
      }
      return error({
        req,
        res,
        body: 'Failed to create book',
        status: 500,
      });
    });
};

export const getBooksReq = async (req: Request, res: Response) => {
  const query: BooksListDTO = req.body;
  const {
    page,
    pageSize,
    sortBy,
    sortOrder,
    search,
    autor_id,
    categorias_id,
    precio_desde,
    precio_hasta,
  } = query;

  return await getBooks(
    {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      sortBy: (sortBy as keyof IBook) || 'id',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'ASC',
    },
    search,
    precio_desde,
    precio_hasta,
    autor_id,
    categorias_id,
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

export const deleteBookReq = async (req: Request, res: Response) => {
  const bookId = Number(req.params.id);
  if (isNaN(bookId)) {
    return error({
      req,
      res,
      body: 'Invalid book ID',
      status: 400,
    });
  }
  return await deleteBook(bookId)
    .then(() => {
      return success({
        req,
        res,
        body: 'Book deleted successfully',
        status: 200,
      });
    })
    .catch((err) => {
      console.error('Error deleting book:', err);
      return error({
        req,
        res,
        body: 'Failed to delete book',
        status: 500,
      });
    });
};

export const getAuthorsReq = async (req: Request, res: Response) => {
  return await getAuthors({
    page: 1,
    pageSize: 10000,
    sortBy: 'id',
    sortOrder: 'ASC',
  })
    .then((body) => {
      return success({
        req,
        res,
        body: body.rows,
      });
    })
    .catch((err) => {
      console.error('Error fetching authors:', err);
      return error({
        req,
        res,
        body: 'Failed to fetch authors',
        status: 500,
      });
    });
};

export const getCategoriesReq = async (req: Request, res: Response) => {
  return await getCategories({
    page: 1,
    pageSize: 10000,
    sortBy: 'id',
    sortOrder: 'ASC',
  })
    .then((body) => {
      return success({
        req,
        res,
        body: body.rows,
      });
    })
    .catch((err) => {
      console.error('Error fetching categories:', err);
      return error({
        req,
        res,
        body: 'Failed to fetch categories',
        status: 500,
      });
    });
};

export const createAuthorReq = async (req: Request, res: Response) => {
  const payload: AuthorCreateDTO = req.body;
  const { nombre, biografia, fecha_nacimiento, nacionalidad } = payload;

  return await createAuthor(nombre, biografia, fecha_nacimiento, nacionalidad)
    .then((author) => {
      return success({
        req,
        res,
        body: author,
        status: 201,
      });
    })
    .catch((err) => {
      console.error('Error creating author:', err);
      return error({
        req,
        res,
        body: 'Failed to create author',
        status: 500,
      });
    });
};

export const deleteAuthorReq = async (req: Request, res: Response) => {
  const authorId = Number(req.params.id);
  if (isNaN(authorId)) {
    return error({
      req,
      res,
      body: 'Invalid author ID',
      status: 400,
    });
  }
  return deleteAuthor(authorId)
    .then(() => {
      return success({
        req,
        res,
        body: 'Author deleted successfully',
        status: 200,
      });
    })
    .catch((err) => {
      console.error('Error deleting author:', err);
      return error({
        req,
        res,
        body: 'Failed to delete author',
        status: 500,
      });
    });
};

export const createCategoryReq = async (req: Request, res: Response) => {
  const payload: CategoryCreateDTO = req.body;
  const { nombre, descripcion } = payload;

  return await createCategory(nombre, descripcion)
    .then((category) => {
      return success({
        req,
        res,
        body: category,
        status: 201,
      });
    })
    .catch((err) => {
      console.error('Error creating category:', err);
      return error({
        req,
        res,
        body: 'Failed to create category',
        status: 500,
      });
    });
};

export const deleteCategoryReq = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);
  if (isNaN(categoryId)) {
    return error({
      req,
      res,
      body: 'Invalid category ID',
      status: 400,
    });
  }
  return deleteCategory(categoryId)
    .then(() => {
      return success({
        req,
        res,
        body: 'Category deleted successfully',
        status: 200,
      });
    })
    .catch((err) => {
      console.error('Error deleting category:', err);
      return error({
        req,
        res,
        body: 'Failed to delete category',
        status: 500,
      });
    });
};
