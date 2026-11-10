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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_schema_1 = require("./schemas/shift.schema");
let ShiftsService = class ShiftsService {
    shiftModel;
    constructor(shiftModel) {
        this.shiftModel = shiftModel;
    }
    async startShift(startShiftDto) {
        const { workerCode } = startShiftDto;
        const activeShift = await this.shiftModel.findOne({ workerCode, status: 'ACTIVE' });
        if (activeShift) {
            throw new common_1.BadRequestException(`El trabajador con código ${workerCode} ya tiene una jornada activa.`);
        }
        const newShift = new this.shiftModel({
            workerCode,
            startTime: new Date(),
            status: 'ACTIVE',
        });
        return newShift.save();
    }
    async endShift(endShiftDto) {
        const { workerCode } = endShiftDto;
        const activeShift = await this.shiftModel.findOne({ workerCode, status: 'ACTIVE' });
        if (!activeShift) {
            throw new common_1.NotFoundException(`No se encontró ninguna jornada activa para el trabajador con código ${workerCode}.`);
        }
        const endTime = new Date();
        const startTime = new Date(activeShift.startTime);
        const totalTimeWorkedMs = endTime.getTime() - startTime.getTime();
        const totalTimeFormatted = this.formatMilliseconds(totalTimeWorkedMs);
        activeShift.endTime = endTime;
        activeShift.totalTimeWorkedMs = totalTimeWorkedMs;
        activeShift.totalTimeFormatted = totalTimeFormatted;
        activeShift.status = 'FINISHED';
        return activeShift.save();
    }
    async getActiveShift(workerCode) {
        return this.shiftModel.findOne({ workerCode, status: 'ACTIVE' });
    }
    formatMilliseconds(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_schema_1.Shift.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map