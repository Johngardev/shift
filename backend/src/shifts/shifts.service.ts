import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shift, ShiftDocument } from './schemas/shift.schema';
import { StartShiftDto, EndShiftDto } from './dto/shift.dto';

@Injectable()
export class ShiftsService {
  constructor(@InjectModel(Shift.name) private shiftModel: Model<ShiftDocument>) {}

  // 1. INICIAR JORNADA (Happy Path + Escenario de Error 1)
  async startShift(startShiftDto: StartShiftDto): Promise<Shift> {
    const { workerCode } = startShiftDto;

    // ESCENARIO DE ERROR 1: Verificar si ya tiene una jornada activa
    const activeShift = await this.shiftModel.findOne({ workerCode, status: 'ACTIVE' });
    if (activeShift) {
      throw new BadRequestException(`El trabajador con código ${workerCode} ya tiene una jornada activa.`);
    }

    // Happy Path: Crear nueva jornada
    const newShift = new this.shiftModel({
      workerCode,
      startTime: new Date(),
      status: 'ACTIVE',
    });

    return newShift.save();
  }

  // 2. TERMINAR JORNADA (Happy Path + Escenario de Error 2)
  async endShift(endShiftDto: EndShiftDto): Promise<Shift> {
    const { workerCode } = endShiftDto;

    // ESCENARIO DE ERROR 2: Verificar si existe una jornada activa para cerrar
    const activeShift = await this.shiftModel.findOne({ workerCode, status: 'ACTIVE' });
    if (!activeShift) {
      throw new NotFoundException(`No se encontró ninguna jornada activa para el trabajador con código ${workerCode}.`);
    }

    const endTime = new Date();
    const startTime = new Date(activeShift.startTime);
    const totalTimeWorkedMs = endTime.getTime() - startTime.getTime();

    // Formatear milisegundos a HH:MM:SS
    const totalTimeFormatted = this.formatMilliseconds(totalTimeWorkedMs);

    // Actualizar registro
    activeShift.endTime = endTime;
    activeShift.totalTimeWorkedMs = totalTimeWorkedMs;
    activeShift.totalTimeFormatted = totalTimeFormatted;
    activeShift.status = 'FINISHED';

    return activeShift.save();
  }

  // 3. Consultar si hay turno activo (Útil para recargar la vista en Angular)
  async getActiveShift(workerCode: string): Promise<Shift | null> {
    return this.shiftModel.findOne({ workerCode, status: 'ACTIVE' });
  }

  private formatMilliseconds(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}