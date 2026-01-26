"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodesAcademiquesModule = void 0;
const common_1 = require("@nestjs/common");
const periodes_academiques_controller_1 = require("./periodes-academiques.controller");
const periodes_academiques_service_1 = require("./periodes-academiques.service");
const journal_module_1 = require("../journal/journal.module");
let PeriodesAcademiquesModule = class PeriodesAcademiquesModule {
};
exports.PeriodesAcademiquesModule = PeriodesAcademiquesModule;
exports.PeriodesAcademiquesModule = PeriodesAcademiquesModule = __decorate([
    (0, common_1.Module)({
        imports: [journal_module_1.JournalModule],
        controllers: [periodes_academiques_controller_1.PeriodesAcademiquesController],
        providers: [periodes_academiques_service_1.PeriodesAcademiquesService],
        exports: [periodes_academiques_service_1.PeriodesAcademiquesService],
    })
], PeriodesAcademiquesModule);
//# sourceMappingURL=periodes-academiques.module.js.map