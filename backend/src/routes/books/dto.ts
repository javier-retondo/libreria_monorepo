import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { IBook } from '../../models';

export class BookCreateDTO {
  @IsString()
  titulo: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precio: number;

  @IsString()
  imagen_url: string;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  autor_id: number;

  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((id) => Number(id));
    }
    if (typeof value === 'string') {
      return value.split(',').map((id) => Number(id.trim()));
    }
    if (typeof value === 'number') {
      return [value];
    }
    return [];
  })
  @Type(() => Number)
  categorias_id?: number[];

  constructor(
    titulo: string,
    descripcion: string,
    precio: number,
    imagen_url: string,
    autor_id: number,
    categorias_id?: number[],
  ) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagen_url = imagen_url;
    this.autor_id = autor_id;
    this.categorias_id = categorias_id;
  }
}

export class CategoryCreateDTO {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  constructor(nombre: string, descripcion?: string) {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }
}

export class BooksListDTO {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  pageSize: number;

  @IsString()
  sortBy: keyof IBook;

  @IsString()
  sortOrder: 'ASC' | 'DESC';

  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    console.log('value :>> ', value);
    if (Array.isArray(value)) {
      return value.map((id) => Number(id));
    }
    if (typeof value === 'string') {
      return value.split(',').map((id) => Number(id.trim()));
    }
    if (typeof value === 'number') {
      return [value];
    }
    return [];
  })
  @IsInt({ each: true })
  autor_id?: number[];

  @IsOptional()
  @Transform(({ value }) => {
    console.log('value :>> ', value);
    if (Array.isArray(value)) {
      return value.map((id) => Number(id));
    }
    if (typeof value === 'string') {
      return value.split(',').map((id) => Number(id.trim()));
    }
    if (typeof value === 'number') {
      return [value];
    }
    return [];
  })
  @IsInt({ each: true })
  categorias_id?: number[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  precio_desde?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  precio_hasta?: number;

  constructor(
    page: number,
    pageSize: number,
    sortBy: keyof IBook,
    sortOrder: 'ASC' | 'DESC',
    search?: string,
    autor_id?: number[],
    categorias_id?: number[],
    precio_desde?: number,
    precio_hasta?: number,
  ) {
    this.page = page;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.search = search;
    this.autor_id = autor_id;
    this.categorias_id = categorias_id;
    this.precio_desde = precio_desde;
    this.precio_hasta = precio_hasta;
  }
}

export class AuthorCreateDTO {
  @IsString()
  nombre: string;

  @IsString()
  biografia: string;

  @IsDate()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  fecha_nacimiento: Date;

  @IsString()
  nacionalidad: string;
  constructor(
    nombre: string,
    biografia: string,
    fecha_nacimiento: Date,
    nacionalidad: string,
  ) {
    this.nombre = nombre;
    this.biografia = biografia;
    this.fecha_nacimiento = fecha_nacimiento;
    this.nacionalidad = nacionalidad;
  }
}
