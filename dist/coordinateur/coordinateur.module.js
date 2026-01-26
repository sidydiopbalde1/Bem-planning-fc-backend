"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinateurModule = void 0;
const common_1 = require("@nestjs/common");
const coordinateur_service_1 = require("./coordinateur.service");
const coordinateur_controller_1 = require("./coordinateur.controller");
let CoordinateurModule = class CoordinateurModule {
};
exports.CoordinateurModule = CoordinateurModule;
exports.CoordinateurModule = CoordinateurModule = __decorate([
    (0, common_1.Module)({
        controllers: [coordinateur_controller_1.CoordinateurController],
        providers: [coordinateur_service_1.CoordinateurService],
        exports: [coordinateur_service_1.CoordinateurService],
    })
], CoordinateurModule);
//# sourceMappingURL=coordinateur.module.js.map