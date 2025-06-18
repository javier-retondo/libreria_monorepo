export interface Book {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen_url?: string;
  createdAt?: Date;
  autor_id: number;

  autor: Author;
  categorias?: Category[];
}

export interface Author {
  id: number;
  nombre: string;
  biografia: string;
  fecha_nacimiento: string;
  nacionalidad: string;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'administrador' | 'usuario';
  pass_provisional: boolean;
  createdAt: Date;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: number;
  fecha: Date;
  usuario_id: number;
  estado: 'pendiente' | 'completado' | 'cancelado';
  provincia: string;
  direccion: string;
  detalles?: string;

  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  libro_id: number;
  cantidad: number;
  precio: number;
  orden_id: number;

  libro?: Book;
  orden?: Order;
}
