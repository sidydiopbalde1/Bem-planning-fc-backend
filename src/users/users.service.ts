import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto, UpdatePasswordDto } from './dto';
import { PaginationDto } from '../common/dto';
import { Role } from '../common/constants/roles.constant';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private journalService: JournalService,
  ) {}
  async create(createUserDto: CreateUserDto, currentUserId?: string, currentUserName?: string) {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email.toLowerCase(),
        name: createUserDto.name,
        password: hashedPassword,
        role: createUserDto.role || Role.TEACHER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    await this.journalService.log({
      action: 'CREATION',
      entite: 'User',
      entiteId: user.id,
      description: `Création de l'utilisateur ${user.name} (${user.email})`,
      nouvelleValeur: { email: user.email, name: user.name, role: user.role },
      userId: currentUserId,
      userName: currentUserName,
    });

    return user;
  }
  async findAll(pagination: PaginationDto, role?: Role) {
    const { skip, take, search, sortBy, sortOrder } = pagination;
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total, statsByRole] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
    ]);

    const limit = pagination.limit ?? 20;

    return {
      data: users,
      pagination: {
        page: pagination.page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        byRole: statsByRole.reduce((acc, item) => {
          acc[item.role] = item._count;
          return acc;
        }, {}),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }



  async update(id: string, updateUserDto: UpdateUserDto, currentUserId?: string, currentUserName?: string) {
    const oldUser = await this.findOne(id);

    if (updateUserDto.email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email.toLowerCase(),
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(updateUserDto.email && { email: updateUserDto.email.toLowerCase() }),
        ...(updateUserDto.name && { name: updateUserDto.name }),
        ...(updateUserDto.role && { role: updateUserDto.role }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'User',
      entiteId: id,
      description: `Modification de l'utilisateur ${updatedUser.name} (${updatedUser.email})`,
      ancienneValeur: { email: oldUser.email, name: oldUser.name, role: oldUser.role },
      nouvelleValeur: { email: updatedUser.email, name: updatedUser.name, role: updatedUser.role },
      userId: currentUserId,
      userName: currentUserName,
    });

    return updatedUser;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new ConflictException('Mot de passe actuel incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  async remove(id: string, currentUserId?: string, currentUserName?: string) {
    const user = await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    await this.journalService.log({
      action: 'SUPPRESSION',
      entite: 'User',
      entiteId: id,
      description: `Suppression de l'utilisateur ${user.name} (${user.email})`,
      ancienneValeur: { email: user.email, name: user.name, role: user.role },
      userId: currentUserId,
      userName: currentUserName,
    });

    return { message: 'Utilisateur supprimé avec succès' };
  }
}
