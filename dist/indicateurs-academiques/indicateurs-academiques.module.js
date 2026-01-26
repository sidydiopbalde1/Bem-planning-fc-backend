"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicateursAcademiquesModule = void 0;
const common_1 = require("@nestjs/common");
const indicateurs_academiques_controller_1 = require("./indicateurs-academiques.controller");
const indicateurs_academiques_service_1 = require("./indicateurs-academiques.service");
let IndicateursAcademiquesModule = class IndicateursAcademiquesModule {
};
exports.IndicateursAcademiquesModule = IndicateursAcademiquesModule;
exports.IndicateursAcademiquesModule = IndicateursAcademiquesModule = __decorate([
    (0, common_1.Module)({
        controllers: [indicateurs_academiques_controller_1.IndicateursAcademiquesController],
        providers: [indicateurs_academiques_service_1.IndicateursAcademiquesService],
        exports: [indicateurs_academiques_service_1.IndicateursAcademiquesService],
    })
], IndicateursAcademiquesModule);
//# sourceMappingURL=indicateurs-academiques.module.js.map