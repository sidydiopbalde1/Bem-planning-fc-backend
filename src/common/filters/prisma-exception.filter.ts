import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erreur de base de données';
    let error = 'Database Error';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[])?.join(', ') || 'champ';
        message = `La valeur du champ "${target}" existe déjà`;
        error = 'Conflict';
        break;

      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Violation de contrainte de clé étrangère';
        error = 'Foreign Key Constraint';
        break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Enregistrement non trouvé';
        error = 'Not Found';
        break;

      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = 'Violation de relation requise';
        error = 'Required Relation';
        break;

      default:
        message = `Erreur Prisma: ${exception.code}`;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      code: exception.code,
      timestamp: new Date().toISOString(),
    });
  }
}
