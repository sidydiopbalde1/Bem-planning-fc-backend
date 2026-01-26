"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.validationSchema = Joi.object({
    PORT: Joi.number().default(3001),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('24h'),
    GOOGLE_CLIENT_ID: Joi.string().allow('').optional(),
    GOOGLE_CLIENT_SECRET: Joi.string().allow('').optional(),
    GOOGLE_CALLBACK_URL: Joi.string().allow('').optional(),
    EMAIL_HOST: Joi.string().allow('').optional(),
    EMAIL_PORT: Joi.number().default(587),
    EMAIL_SECURE: Joi.boolean().default(false),
    EMAIL_USER: Joi.string().allow('').optional(),
    EMAIL_PASSWORD: Joi.string().allow('').optional(),
    EMAIL_FROM: Joi.string().allow('').optional(),
    CRON_ENABLED: Joi.boolean().default(true),
    CRON_SECRET: Joi.string().allow('').optional(),
    FRONTEND_URL: Joi.string().default('http://localhost:3000'),
});
//# sourceMappingURL=validation.schema.js.map