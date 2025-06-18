import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IUser, OrderStatus } from '../../models';

class OrderDataDTO {
  @IsString()
  provincia: string;

  @IsString()
  direccion: string;

  @IsString()
  detalles: string;

  constructor(provincia: string, direccion: string, detalles: string) {
    this.provincia = provincia;
    this.direccion = direccion;
    this.detalles = detalles;
  }
}

class OrderItemDTO {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  libro_id: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  cantidad: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  precio: number;

  constructor(libro_id: number, cantidad: number, precio: number) {
    this.libro_id = libro_id;
    this.cantidad = cantidad;
    this.precio = precio;
  }
}

export class OrdersListDTO {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  pageSize: number;

  @IsString()
  sortBy: keyof IUser;

  @IsString()
  sortOrder: 'ASC' | 'DESC';

  @IsString()
  @IsOptional()
  estado?: OrderStatus;

  @IsInt({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    return value ? [Number(value)] : [];
  })
  usuario_id?: number[];

  @IsInt({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    return value ? [Number(value)] : [];
  })
  libro_id?: number[];

  @IsDate()
  @Transform(({ value }) => {
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string') {
      return new Date(value);
    }
    return undefined;
  })
  @Type(() => Date)
  @IsOptional()
  date?: Date;

  constructor(
    page: number,
    pageSize: number,
    sortBy: keyof IUser,
    sortOrder: 'ASC' | 'DESC',
    estado?: OrderStatus,
    usuario_id?: number[],
    libro_id?: number[],
    date?: Date,
  ) {
    this.page = page;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.estado = estado;
    this.usuario_id = usuario_id;
    this.libro_id = libro_id;
    this.date = date;
  }
}

export class CreateOrderDTO {
  @ValidateNested()
  @Type(() => OrderDataDTO)
  orderData: OrderDataDTO;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  constructor(orderData: OrderDataDTO, items: OrderItemDTO[]) {
    this.orderData = orderData;
    this.items = items;
  }
}

enum OrderUpdateStatus {
  COMPLETED = 'completado',
  CANCELED = 'cancelado',
}

export class UpdateOrderDTO {
  @IsEnum(OrderUpdateStatus)
  @IsOptional()
  estado: OrderStatus.COMPLETED | OrderStatus.CANCELED;

  constructor(estado: OrderStatus.COMPLETED | OrderStatus.CANCELED) {
    this.estado = estado;
  }
}
