import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../common/constants/roles.constant';

export class SignupDto {
  @ApiProperty({ example: 'utilisateur@bem.sn' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({ example: 'Jean Dupont' })
  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.TEACHER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.TEACHER;
}
