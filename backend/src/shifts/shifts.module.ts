import { Module } from '@nestjs/common';
import { Shift, ShiftSchema } from './schemas/shift.schema';
import { MongooseModule } from 'node_modules/@nestjs/mongoose/dist/mongoose.module';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }])
    ],
    controllers: [ShiftsController],
    providers: [ShiftsService],
})
export class ShiftsModule {}
