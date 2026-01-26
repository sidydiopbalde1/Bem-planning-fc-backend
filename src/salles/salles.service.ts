import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';

@Injectable()
export class SallesService {
  constructor(
    private prisma: PrismaService,
    private journalService: JournalService,
  ) {}

  async findAll(pagination: PaginationDto, batiment?: string) {
    const { skip, take, search, sortBy, sortOrder } = pagination;
    const where: any = {};

    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { batiment: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (batiment) where.batiment = batiment;

    const [salles, total, statsByBatiment] = await Promise.all([
      this.prisma.salle.findMany({
        where,
        skip,
        take,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { nom: 'asc' },
      }),
      this.prisma.salle.count({ where }),
      this.prisma.salle.groupBy({
        by: ['batiment'],
        _count: true,
      }),
    ]);

    const limit = pagination.limit ?? 10;

    return {
      data: salles,
      pagination: {
        page: pagination.page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total,
        disponibles: salles.filter(s => s.disponible).length,
        parBatiment: statsByBatiment.reduce((acc, item) => {
          acc[item.batiment || 'Non défini'] = item._count;
          return acc;
        }, {}),
      },
    };
  }

  async findOne(id: string) {
    const salle = await this.prisma.salle.findUnique({
      where: { id },
    });

    if (!salle) {
      throw new NotFoundException('Salle non trouvée');
    }

    return salle;
  }

  async create(data: any, currentUserId?: string, currentUserName?: string) {
    const existing = await this.prisma.salle.findUnique({
      where: { nom: data.nom },
    });

    if (existing) {
      throw new ConflictException('Une salle avec ce nom existe déjà');
    }

    const salle = await this.prisma.salle.create({ data });

    await this.journalService.log({
      action: 'CREATION',
      entite: 'Salle',
      entiteId: salle.id,
      description: `Création de la salle ${salle.nom}`,
      nouvelleValeur: { nom: salle.nom, batiment: salle.batiment, capacite: salle.capacite },
      userId: currentUserId,
      userName: currentUserName,
    });

    return salle;
  }

  async update(id: string, data: any, currentUserId?: string, currentUserName?: string) {
    const oldSalle = await this.findOne(id);

    if (data.nom) {
      const existing = await this.prisma.salle.findFirst({
        where: { nom: data.nom, NOT: { id } },
      });

      if (existing) {
        throw new ConflictException('Une salle avec ce nom existe déjà');
      }
    }

    const updatedSalle = await this.prisma.salle.update({ where: { id }, data });

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'Salle',
      entiteId: id,
      description: `Modification de la salle ${updatedSalle.nom}`,
      ancienneValeur: { nom: oldSalle.nom, batiment: oldSalle.batiment, capacite: oldSalle.capacite },
      nouvelleValeur: { nom: updatedSalle.nom, batiment: updatedSalle.batiment, capacite: updatedSalle.capacite },
      userId: currentUserId,
      userName: currentUserName,
    });

    return updatedSalle;
  }

  async remove(id: string, currentUserId?: string, currentUserName?: string) {
    const salle = await this.findOne(id);
    await this.prisma.salle.delete({ where: { id } });

    await this.journalService.log({
      action: 'SUPPRESSION',
      entite: 'Salle',
      entiteId: id,
      description: `Suppression de la salle ${salle.nom}`,
      ancienneValeur: { nom: salle.nom, batiment: salle.batiment, capacite: salle.capacite },
      userId: currentUserId,
      userName: currentUserName,
    });

    return { message: 'Salle supprimée avec succès' };
  }
}
