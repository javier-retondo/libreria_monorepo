export interface Book {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  autor: Author;
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
