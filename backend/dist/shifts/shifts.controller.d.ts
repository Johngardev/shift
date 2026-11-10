import { ShiftsService } from './shifts.service';
import { StartShiftDto, EndShiftDto } from './dto/shift.dto';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    startShift(startShiftDto: StartShiftDto): Promise<{
        message: string;
        data: import("./schemas/shift.schema").Shift;
    }>;
    endShift(endShiftDto: EndShiftDto): Promise<{
        message: string;
        data: import("./schemas/shift.schema").Shift;
    }>;
    getActiveShift(code: string): Promise<{
        hasActiveShift: boolean;
        data: import("./schemas/shift.schema").Shift | null;
    }>;
}
