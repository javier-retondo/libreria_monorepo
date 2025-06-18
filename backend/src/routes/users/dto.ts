import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { IUser, UserRole } from '../../models';

export class UserListDTO {
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
  search?: string;

  @IsString()
  @IsOptional()
  rol?: UserRole;

  constructor(
    page: number,
    pageSize: number,
    sortBy: keyof IUser,
    sortOrder: 'ASC' | 'DESC',
    search?: string,
    rol?: UserRole,
  ) {
    this.page = page;
    this.pageSize = pageSize;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    this.search = search;
    this.rol = rol;
  }
}
