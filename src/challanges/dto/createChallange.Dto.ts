import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  challengeName: string;

  @IsNumber()
  @Min(1) 
  targetSteps: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean; 
}