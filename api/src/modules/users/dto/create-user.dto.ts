import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { IsCpf } from '../../../shared/utils';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Nome: Campo obrigatório.' })
  @IsString({ message: 'Nome: Precisa ser uma string.' })
  @MinLength(5, { message: 'Nome: Precisa ter pelo menos 5 caracteres.' })
  @MaxLength(50, { message: 'Nome: Máximo de 50 caracteres.' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email: Campo obrigatório.' })
  @IsEmail({}, { message: 'Email: email inválido.' })
  @MaxLength(50, { message: 'Email: Máximo de 50 caracteres.' })
  email: string;

  @ApiProperty()
  @Validate(IsCpf)
  cpf: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Senha: Campo obrigatório.' })
  @IsString({ message: 'Senha: Precisa ser uma string.' })
  @MinLength(8, { message: 'Senha: Precisa ter pelo menos 8 caracteres.' })
  password: string;
}
