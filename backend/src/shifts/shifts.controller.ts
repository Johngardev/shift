import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { StartShiftDto, EndShiftDto } from './dto/shift.dto';

@Controller('shifts')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post('start')
  async startShift(@Body() startShiftDto: StartShiftDto) {
    const shift = await this.shiftsService.startShift(startShiftDto);
    return {
      message: 'Jornada iniciada con éxito',
      data: shift,
    };
  }

  @Post('end')
  async endShift(@Body() endShiftDto: EndShiftDto) {
    const shift = await this.shiftsService.endShift(endShiftDto);
    return {
      message: 'Jornada finalizada con éxito',
      data: shift,
    };
  }

  @Get('active/:code')
  async getActiveShift(@Param('code') code: string) {
    const shift = await this.shiftsService.getActiveShift(code);
    return {
      hasActiveShift: !!shift,
      data: shift,
    };
  }
}