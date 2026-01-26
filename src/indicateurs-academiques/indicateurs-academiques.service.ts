import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIndicateurAcademiqueDto } from './dto/create-indicateur-academique.dto';
import { UpdateIndicateurAcademiqueDto } from './dto/update-indicateur-academique.dto';

@Injectable()
export class IndicateursAcademiquesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(programmeId?: string, periodeId?: string) {
    const where: any = {};

    if (programmeId) where.programmeId = programmeId;
    if (periodeId) where.periodeId = periodeId;

    return this.prisma.indicateurAcademique.findMany({
      where,
      include: {
        programme: {
          select: { id: true, name: true, code: true },
        },
        periode: {
          select: { id: true, nom: true, annee: true },
        },
        responsable: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const indicateur = await this.prisma.indicateurAcademique.findUnique({
      where: { id },
      include: {
        programme: {
          select: { id: true, name: true, code: true },
        },
        periode: {
          select: { id: true, nom: true, annee: true },
        },
        responsable: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!indicateur) {
      throw new NotFoundException(`Indicateur académique ${id} non trouvé`);
    }

    return indicateur;
  }

  async create(data: CreateIndicateurAcademiqueDto) {
    return this.prisma.indicateurAcademique.create({
      data: {
        nom: data.nom,
        description: data.description,
        valeurCible: data.valeurCible,
        valeurReelle: data.valeurReelle,
        periodicite: data.periodicite,
        methodeCalcul: data.methodeCalcul,
        unite: data.unite || '%',
        type: data.type,
        programmeId: data.programmeId,
        periodeId: data.periodeId,
        responsableId: data.responsableId,
        dateCollecte: data.dateCollecte ? new Date(data.dateCollecte) : null,
      },
      include: {
        programme: {
          select: { id: true, name: true, code: true },
        },
        periode: {
          select: { id: true, nom: true, annee: true },
        },
        responsable: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateIndicateurAcademiqueDto) {
    await this.findOne(id);

    const updateData: any = {};

    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.valeurCible !== undefined) updateData.valeurCible = data.valeurCible;
    if (data.valeurReelle !== undefined) updateData.valeurReelle = data.valeurReelle;
    if (data.periodicite !== undefined) updateData.periodicite = data.periodicite;
    if (data.methodeCalcul !== undefined) updateData.methodeCalcul = data.methodeCalcul;
    if (data.unite !== undefined) updateData.unite = data.unite;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.programmeId !== undefined) updateData.programmeId = data.programmeId;
    if (data.periodeId !== undefined) updateData.periodeId = data.periodeId;
    if (data.responsableId !== undefined) updateData.responsableId = data.responsableId;
    if (data.dateCollecte !== undefined) {
      updateData.dateCollecte = data.dateCollecte ? new Date(data.dateCollecte) : null;
    }

    return this.prisma.indicateurAcademique.update({
      where: { id },
      data: updateData,
      include: {
        programme: {
          select: { id: true, name: true, code: true },
        },
        periode: {
          select: { id: true, nom: true, annee: true },
        },
        responsable: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.indicateurAcademique.delete({
      where: { id },
    });
  }
}
