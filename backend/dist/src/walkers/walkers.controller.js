"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkersController = void 0;
const common_1 = require("@nestjs/common");
const walkers_service_1 = require("./walkers.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const search_walkers_dto_1 = require("./dto/search-walkers.dto");
let WalkersController = class WalkersController {
    walkersService;
    constructor(walkersService) {
        this.walkersService = walkersService;
    }
    async getWalkers(searchDto) {
        return this.walkersService.searchWalkers(searchDto);
    }
    async getWalker(id) {
        return this.walkersService.getWalkerById(id);
    }
};
exports.WalkersController = WalkersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_walkers_dto_1.SearchWalkersDto]),
    __metadata("design:returntype", Promise)
], WalkersController.prototype, "getWalkers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalkersController.prototype, "getWalker", null);
exports.WalkersController = WalkersController = __decorate([
    (0, common_1.Controller)('walkers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [walkers_service_1.WalkersService])
], WalkersController);
//# sourceMappingURL=walkers.controller.js.map