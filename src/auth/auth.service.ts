import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { LoginDto, SignupDto, AuthResponseDto, UserResponseDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from '../common/constants/roles.constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private journalService: JournalService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role as Role,
      createdAt: user.createdAt,
    };
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      await this.journalService.log({
        action: 'CONNEXION',
        entite: 'Auth',
        entiteId: 'failed',
        description: `Tentative de connexion échouée pour ${loginDto.email}`,
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    // Log connexion réussie
    await this.journalService.log({
      action: 'CONNEXION',
      entite: 'User',
      entiteId: user.id,
      description: `Connexion de l'utilisateur ${user.name} (${user.email})`,
      userId: user.id,
      userName: user.name,
      ipAddress,
      userAgent,
    });
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async signup(signupDto: SignupDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: signupDto.email.toLowerCase(),
        name: signupDto.name,
        password: hashedPassword,
        role: signupDto.role || Role.TEACHER,
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    };

    // Log inscription
    await this.journalService.log({
      action: 'CREATION',
      entite: 'User',
      entiteId: user.id,
      description: `Inscription de l'utilisateur ${user.name} (${user.email})`,
      nouvelleValeur: { email: user.email, name: user.name, role: user.role },
      userId: user.id,
      userName: user.name || '',
      ipAddress,
      userAgent,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role as Role,
        createdAt: user.createdAt,
      },
    };
  }

  async validateGoogleUser(profile: { email: string; name: string }, ipAddress?: string, userAgent?: string): Promise<UserResponseDto> {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email.toLowerCase() },
    });

    if (!user) {
      // Pour les utilisateurs Google, on génère un password aléatoire (non utilisé)
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 12);
      user = await this.prisma.user.create({
        data: {
          email: profile.email.toLowerCase(),
          name: profile.name,
          password: randomPassword,
          role: Role.TEACHER,
        },
      });

      // Log création via Google
      await this.journalService.log({
        action: 'CREATION',
        entite: 'User',
        entiteId: user.id,
        description: `Création du compte via Google pour ${user.name} (${user.email})`,
        nouvelleValeur: { email: user.email, name: user.name, role: user.role },
        userId: user.id,
        userName: user.name || '',
        ipAddress,
        userAgent,
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role as Role,
      createdAt: user.createdAt,
    };
  }

  async googleLogin(user: UserResponseDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Log connexion Google
    await this.journalService.log({
      action: 'CONNEXION',
      entite: 'User',
      entiteId: user.id,
      description: `Connexion via Google de ${user.name} (${user.email})`,
      userId: user.id,
      userName: user.name,
      ipAddress,
      userAgent,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role as Role,
      createdAt: user.createdAt,
    };
  }
}
