import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50) 
  groupName: string;

  @IsString()
  @MaxLength(200) 
  info: string; 
               
}