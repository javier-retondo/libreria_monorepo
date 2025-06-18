import { Router } from 'express';
import {
  createAuthorReq,
  createBookReq,
  createCategoryReq,
  deleteAuthorReq,
  deleteBookReq,
  deleteCategoryReq,
  getAuthorsReq,
  getBooksReq,
  getCategoriesReq,
} from './controller';
import { validationMiddleware } from '../../middlewares/classValidator';
import {
  AuthorCreateDTO,
  BookCreateDTO,
  BooksListDTO,
  CategoryCreateDTO,
} from './dto';
import { checkUser } from '../../middlewares/checkUser';
import { handleImageUpload } from '../../middlewares/uploadImage';

const BookRouter = Router()
  .post(
    '/book',
    checkUser,
    handleImageUpload,
    checkUser,
    validationMiddleware(BookCreateDTO, 'body'),
    createBookReq,
  )
  .get('/books', validationMiddleware(BooksListDTO, 'query'), getBooksReq)
  .delete('/book/:id', checkUser, deleteBookReq)
  .get('/authors', checkUser, getAuthorsReq)
  .post(
    '/author',
    checkUser,
    validationMiddleware(AuthorCreateDTO, 'body'),
    createAuthorReq,
  )
  .delete('/author/:id', checkUser, deleteAuthorReq)
  .get('/categories', checkUser, getCategoriesReq)
  .post(
    '/category',
    checkUser,
    validationMiddleware(CategoryCreateDTO, 'body'),
    createCategoryReq,
  )
  .delete('/category/:id', checkUser, deleteCategoryReq);

export default BookRouter;
