import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Nome: Precisa ser uma string.' })
  @MinLength(5, { message: 'Nome: Precisa ter pelo menos 5 caracteres.' })
  @MaxLength(50, { message: 'Nome: Máximo de 50 caracteres.' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Email: email inválido.' })
  @MaxLength(50, { message: 'Email: Máximo de 50 caracteres.' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Senha: Precisa ser uma string.' })
  @MinLength(8, { message: 'Senha: Precisa ter pelo menos 8 caracteres.' })
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Senha antiga: Precisa ser uma string.' })
  @MinLength(8, { message: 'Senha antiga: Precisa ter pelo menos 8 caracteres.' })
  oldPassword?: string;
}
