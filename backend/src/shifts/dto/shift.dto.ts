import { IsString, IsNotEmpty } from 'class-validator';

export class StartShiftDto {
    @IsString()
    @IsNotEmpty({ message: 'El código del trabajador es obligatorio' })
    workerCode!: string;
}

export class EndShiftDto {
    @IsString()
    @IsNotEmpty({ message: 'El código del trabajador es obligatorio' })
    workerCode!: string;
}