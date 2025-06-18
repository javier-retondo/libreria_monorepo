import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}

export class ResetPasswordDTO {
  @IsEmail()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}

export class ChangePasswordDTO {
  @IsString()
  password: string;

  constructor(password: string) {
    this.password = password;
  }
}
