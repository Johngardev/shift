import { Document } from 'mongoose';
export type ShiftDocument = Shift & Document;
export declare class Shift {
    workerCode: string;
    startTime: Date;
    endTime: Date;
    totalTimeWorkedMs: number;
    totalTimeFormatted: string;
    status: string;
}
export declare const ShiftSchema: import("mongoose").Schema<Shift, import("mongoose").Model<Shift, any, any, any, any, any, Shift & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Shift, Document<unknown, {}, Shift, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    workerCode?: import("mongoose").SchemaDefinitionProperty<string, Shift, Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    startTime?: import("mongoose").SchemaDefinitionProperty<Date, Shift, Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    endTime?: import("mongoose").SchemaDefinitionProperty<Date, Shift, Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalTimeWorkedMs?: import("mongoose").SchemaDefinitionProperty<number, Shift, Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    totalTimeFormatted?: import("mongoose").SchemaDefinitionProperty<string, Shift, Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Shift, Document<unknown, {}, Shift, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Shift>;
