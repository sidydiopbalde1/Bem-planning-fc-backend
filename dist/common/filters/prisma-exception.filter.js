"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaExceptionFilter = class PrismaExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Erreur de base de données';
        let error = 'Database Error';
        switch (exception.code) {
            case 'P2002':
                status = common_1.HttpStatus.CONFLICT;
                const target = exception.meta?.target?.join(', ') || 'champ';
                message = `La valeur du champ "${target}" existe déjà`;
                error = 'Conflict';
                break;
            case 'P2003':
                status = common_1.HttpStatus.BAD_REQUEST;
                message = 'Violation de contrainte de clé étrangère';
                error = 'Foreign Key Constraint';
                break;
            case 'P2025':
                status = common_1.HttpStatus.NOT_FOUND;
                message = 'Enregistrement non trouvé';
                error = 'Not Found';
                break;
            case 'P2014':
                status = common_1.HttpStatus.BAD_REQUEST;
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
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map