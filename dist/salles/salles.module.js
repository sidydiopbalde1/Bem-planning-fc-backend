"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SallesModule = void 0;
const common_1 = require("@nestjs/common");
const salles_service_1 = require("./salles.service");
const salles_controller_1 = require("./salles.controller");
const journal_module_1 = require("../journal/journal.module");
let SallesModule = class SallesModule {
};
exports.SallesModule = SallesModule;
exports.SallesModule = SallesModule = __decorate([
    (0, common_1.Module)({
        imports: [journal_module_1.JournalModule],
        controllers: [salles_controller_1.SallesController],
        providers: [salles_service_1.SallesService],
        exports: [salles_service_1.SallesService],
    })
], SallesModule);
//# sourceMappingURL=salles.module.js.map