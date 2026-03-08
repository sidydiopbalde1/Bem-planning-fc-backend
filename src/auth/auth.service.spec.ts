import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { Role } from '../common/constants/roles.constant';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let journalService: jest.Mocked<JournalService>;

  const mockUser = {
    id: 'user-id-1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    role: Role.TEACHER,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: JournalService,
          useValue: {
            log: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    journalService = module.get(JournalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── validateUser ───────────────────────────────────────────────────────────

  describe('validateUser', () => {
    it('retourne null si l\'utilisateur n\'existe pas', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser('inexistant@test.com', 'password');

      expect(result).toBeNull();
    });

    it('retourne null si le mot de passe est incorrect', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(mockUser.email, 'wrong-password');

      expect(result).toBeNull();
    });

    it('retourne l\'utilisateur si les identifiants sont corrects', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, 'correct-password');

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      });
    });

    it('recherche l\'email en minuscules', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await service.validateUser('TEST@EXAMPLE.COM', 'password');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  // ─── login ───────────────────────────────────────────────────────────────────

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    it('lève UnauthorizedException si les identifiants sont invalides', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('retourne access_token et user si connexion réussie', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('signe le JWT avec le bon payload', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.login(loginDto);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('logue l\'échec de connexion dans le journal', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.login(loginDto, '127.0.0.1', 'Mozilla')).rejects.toThrow();

      expect(journalService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CONNEXION', entiteId: 'failed' }),
      );
    });

    it('logue la connexion réussie dans le journal', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.login(loginDto, '127.0.0.1', 'Mozilla');

      expect(journalService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CONNEXION', entiteId: mockUser.id }),
      );
    });
  });

  // ─── signup ──────────────────────────────────────────────────────────────────

  describe('signup', () => {
    const signupDto = {
      email: 'nouveau@example.com',
      password: 'password123',
      name: 'Nouveau User',
    };

    it('lève ConflictException si l\'email existe déjà', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
    });

    it('crée l\'utilisateur et retourne access_token si email libre', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prismaService.user.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: signupDto.email,
        name: signupDto.name,
      });

      const result = await service.signup(signupDto);

      expect(result).toHaveProperty('access_token', 'mock-jwt-token');
      expect(result.user.email).toBe(signupDto.email);
    });

    it('hache le mot de passe avant de créer l\'utilisateur', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prismaService.user.create as jest.Mock).mockResolvedValue({ ...mockUser });

      await service.signup(signupDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 12);
    });

    it('assigne le rôle TEACHER par défaut', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prismaService.user.create as jest.Mock).mockResolvedValue({ ...mockUser });

      await service.signup(signupDto);

      expect(prismaService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ role: Role.TEACHER }),
        }),
      );
    });
  });

  // ─── getProfile ──────────────────────────────────────────────────────────────

  describe('getProfile', () => {
    it('retourne le profil de l\'utilisateur', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      });
    });

    it('lève UnauthorizedException si l\'utilisateur n\'existe pas', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getProfile('inexistant-id')).rejects.toThrow(UnauthorizedException);
    });
  });
});
