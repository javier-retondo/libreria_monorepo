import { Author, IAuthor } from './Author';
import { Book, IBook, initBookAssociations } from './Book';
import { Category, ICategory } from './Category';
import { BookCategory, IBookCategory } from './BookCategory';
import { User, IUser, UserRole } from './User';
import { Order, IOrder, initOrderAssociations, OrderStatus } from './Order';
import {
  OrderItem,
  IOrderItem,
  initOrderItemAssociations,
} from './OrderDetail';

const initAssociations = () => {
  console.log('🚀 Iniciando asociaciones de modelos...');
  initOrderAssociations();
  initOrderItemAssociations();
  initBookAssociations();
  console.log('✅ Asociaciones de modelos inicializadas correctamente.');
};

export {
  Author,
  IAuthor,
  Book,
  IBook,
  Category,
  ICategory,
  BookCategory,
  IBookCategory,
  User,
  IUser,
  UserRole,
  Order,
  IOrder,
  OrderStatus,
  OrderItem,
  IOrderItem,
  initAssociations,
};
