import { Roles } from '../../users/users.schema'; 
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from "class-validator"; 

export class RegisterUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) 
  password: string;

  @IsOptional()
  @IsEnum(Roles) 
  role?: Roles;
}