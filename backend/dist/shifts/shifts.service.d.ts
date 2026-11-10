import { Model } from 'mongoose';
import { Shift, ShiftDocument } from './schemas/shift.schema';
import { StartShiftDto, EndShiftDto } from './dto/shift.dto';
export declare class ShiftsService {
    private shiftModel;
    constructor(shiftModel: Model<ShiftDocument>);
    startShift(startShiftDto: StartShiftDto): Promise<Shift>;
    endShift(endShiftDto: EndShiftDto): Promise<Shift>;
    getActiveShift(workerCode: string): Promise<Shift | null>;
    private formatMilliseconds;
    findAll(): Promise<Shift[]>;
}
