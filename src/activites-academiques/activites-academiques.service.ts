import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActiviteAcademiqueDto } from './dto/create-activite-academique.dto';
import { UpdateActiviteAcademiqueDto } from './dto/update-activite-academique.dto';

@Injectable()
export class ActivitesAcademiquesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(programmeId?: string, periodeId?: string) {
    const where: Prisma.ActiviteAcademiqueWhereInput = {};

    if (programmeId) where.programmeId = programmeId;
    if (periodeId) where.periodeId = periodeId;

    return this.prisma.activiteAcademique.findMany({
      where,
      include: {
        programme: {
          select: { id: true, name: true, code: true },
        },
        periode: {
          select: { id: true, nom: true, annee: true },
        },
      },
      orderBy: { datePrevue: 'asc' },
    });
  }

  async findOne(id: string) {
    const activite = await this.prisma.activiteAcademique.findUnique({
      where: { id },
      include: {
        programme: {
          select: { id: true, name: true, code: true },
        },
        periode: {
          select: { id: true, nom: true, annee: true },
        },
      },
    });

    if (!activite) {
      throw new NotFoundException(`Activité académique ${id} non trouvée`);
    }

    return activite;
  }

  async create(data: CreateActiviteAcademiqueDto) {
    return this.prisma.activiteAcademique.create({
      data: {
        nom: data.nom,
        description: data.description,
        datePrevue: data.datePrevue ? new Date(data.datePrevue) : null,
        dateReelle: data.dateReelle ? new Date(data.dateReelle) : null,
        type: data.type,
        programmeId: data.programmeId,
        periodeId: data.periodeId,
      },
      include: {
        programme: {
          select: { id: true, name: true, code: true },
        },
        periode: {
          select: { id: true, nom: true, annee: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateActiviteAcademiqueDto) {
    await this.findOne(id);

    const updateData: Prisma.ActiviteAcademiqueUpdateInput = {};

    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.datePrevue !== undefined)
      updateData.datePrevue = data.datePrevue
        ? new Date(data.datePrevue)
        : null;
    if (data.dateReelle !== undefined)
      updateData.dateReelle = data.dateReelle
        ? new Date(data.dateReelle)
        : null;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.programmeId !== undefined)
      updateData.programme = { connect: { id: data.programmeId } };
    if (data.periodeId !== undefined)
      updateData.periode = { connect: { id: data.periodeId } };

    return this.prisma.activiteAcademique.update({
      where: { id },
      data: updateData,
      include: {
        programme: {
          select: { id: true, name: true, code: true },
        },
        periode: {
          select: { id: true, nom: true, annee: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.activiteAcademique.delete({
      where: { id },
    });
  }
}
