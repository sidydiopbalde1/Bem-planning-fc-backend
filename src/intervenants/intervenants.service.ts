import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { PaginationDto } from '../common/dto';

@Injectable()
export class IntervenantsService {
  constructor(
    private prisma: PrismaService,
    private journalService: JournalService,
  ) {}

  async findAll(pagination: PaginationDto) {
    const { skip, take, search, sortBy, sortOrder } = pagination;

    const where: any = {};
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [intervenants, total] = await Promise.all([
      this.prisma.intervenant.findMany({
        where,
        skip,
        take,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
          modules: {
            select: { id: true, name: true, code: true, status: true },
          },
          _count: {
            select: { seances: true },
          },
        },
      }),
      this.prisma.intervenant.count({ where }),
    ]);

    const limit = pagination.limit ?? 20;

    return {
      data: intervenants,
      pagination: {
        page: pagination.page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
  async create(data: any, currentUserId?: string, currentUserName?: string) {
    const existing = await this.prisma.intervenant.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Un intervenant avec cet email existe déjà');
    }

    const intervenant = await this.prisma.intervenant.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });

    await this.journalService.log({
      action: 'CREATION',
      entite: 'Intervenant',
      entiteId: intervenant.id,
      description: `Création de l'intervenant ${intervenant.prenom} ${intervenant.nom} (${intervenant.email})`,
      nouvelleValeur: { nom: intervenant.nom, prenom: intervenant.prenom, email: intervenant.email, specialite: intervenant.specialite },
      userId: currentUserId,
      userName: currentUserName,
    });

    return intervenant;
  }
  async findOne(id: string) {
    const intervenant = await this.prisma.intervenant.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            programme: { select: { id: true, name: true, code: true } },
          },
        },
        seances: {
          take: 10,
          orderBy: { dateSeance: 'desc' },
          include: {
            module: { select: { id: true, name: true, code: true } },
          },
        },
        disponibilites: true,
      },
    });

    if (!intervenant) {
      throw new NotFoundException('Intervenant non trouvé');
    }

    return intervenant;
  }



  async update(id: string, data: any, currentUserId?: string, currentUserName?: string) {
    const oldIntervenant = await this.findOne(id);

    if (data.email) {
      const existing = await this.prisma.intervenant.findFirst({
        where: {
          email: data.email.toLowerCase(),
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Un intervenant avec cet email existe déjà');
      }
    }

    const updatedIntervenant = await this.prisma.intervenant.update({
      where: { id },
      data: {
        ...data,
        ...(data.email && { email: data.email.toLowerCase() }),
      },
    });

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'Intervenant',
      entiteId: id,
      description: `Modification de l'intervenant ${updatedIntervenant.prenom} ${updatedIntervenant.nom}`,
      ancienneValeur: { nom: oldIntervenant.nom, prenom: oldIntervenant.prenom, email: oldIntervenant.email, specialite: oldIntervenant.specialite },
      nouvelleValeur: { nom: updatedIntervenant.nom, prenom: updatedIntervenant.prenom, email: updatedIntervenant.email, specialite: updatedIntervenant.specialite },
      userId: currentUserId,
      userName: currentUserName,
    });

    return updatedIntervenant;
  }

  async remove(id: string, currentUserId?: string, currentUserName?: string) {
    const intervenant = await this.findOne(id);

    // Vérifier s'il a des modules en cours
    const modulesEnCours = intervenant.modules.filter(m => m.status === 'EN_COURS');
    if (modulesEnCours.length > 0) {
      throw new BadRequestException('Impossible de supprimer: cet intervenant a des modules en cours');
    }

    // Vérifier s'il a des séances futures
    const seancesFutures = await this.prisma.seance.count({
      where: {
        intervenantId: id,
        dateSeance: { gt: new Date() },
        status: { not: 'ANNULE' },
      },
    });

    if (seancesFutures > 0) {
      throw new BadRequestException('Impossible de supprimer: cet intervenant a des séances futures');
    }

    await this.prisma.intervenant.delete({ where: { id } });

    await this.journalService.log({
      action: 'SUPPRESSION',
      entite: 'Intervenant',
      entiteId: id,
      description: `Suppression de l'intervenant ${intervenant.prenom} ${intervenant.nom} (${intervenant.email})`,
      ancienneValeur: { nom: intervenant.nom, prenom: intervenant.prenom, email: intervenant.email, specialite: intervenant.specialite },
      userId: currentUserId,
      userName: currentUserName,
    });

    return { message: 'Intervenant supprimé avec succès' };
  }

  async updateDisponibilite(id: string, disponible: boolean, currentUserId?: string, currentUserName?: string) {
    const intervenant = await this.findOne(id);

    const updatedIntervenant = await this.prisma.intervenant.update({
      where: { id },
      data: { disponible },
    });

    await this.journalService.log({
      action: 'MODIFICATION',
      entite: 'Intervenant',
      entiteId: id,
      description: `Mise à jour de la disponibilité de ${intervenant.prenom} ${intervenant.nom}: ${disponible ? 'disponible' : 'indisponible'}`,
      ancienneValeur: { disponible: intervenant.disponible },
      nouvelleValeur: { disponible },
      userId: currentUserId,
      userName: currentUserName,
    });

    return updatedIntervenant;
  }

  async getMesSeances(email: string, filters: any) {
    const intervenant = await this.prisma.intervenant.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!intervenant) {
      throw new NotFoundException('Intervenant non trouvé');
    }

    const where: any = { intervenantId: intervenant.id };

    if (filters.status) where.status = filters.status;
    if (filters.startDate) where.dateSeance = { gte: new Date(filters.startDate) };
    if (filters.endDate) {
      where.dateSeance = { ...where.dateSeance, lte: new Date(filters.endDate) };
    }

    const seances = await this.prisma.seance.findMany({
      where,
      include: {
        module: {
          include: {
            programme: { select: { id: true, name: true, code: true } },
          },
        },
      },
      orderBy: { dateSeance: 'asc' },
    });

    // Stats
    const stats = {
      total: seances.length,
      terminees: seances.filter(s => s.status === 'TERMINE').length,
      enCours: seances.filter(s => s.status === 'EN_COURS').length,
      planifiees: seances.filter(s => s.status === 'PLANIFIE').length,
    };

    return { seances, stats };
  }
}
