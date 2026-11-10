import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShiftDocument = Shift & Document;

@Schema({ timestamps: true })
export class Shift {
  @Prop({ required: true })
    workerCode!: string;

  @Prop({ required: true, default: Date.now })
    startTime!: Date;

  @Prop({ default: null })
    endTime!: Date;

  @Prop({ default: null })
    totalTimeWorkedMs!: number;

  @Prop({ default: null })
    totalTimeFormatted!: string;

  @Prop({ required: true, enum: ['ACTIVE', 'FINISHED'], default: 'ACTIVE' })
    status!: string;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);