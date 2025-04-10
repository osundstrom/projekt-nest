import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//

@Schema({collection: "groups"})
export class Groups extends Document {
    @Prop({unique: true, required: true})
    groupName: string;

    @Prop({required: true, default: 0 })
    totalSteps: number;

    @Prop({ required: true})
    info: string;

    @Prop({required: true, default: 1})
    numberMembers: number;

    @Prop({required: true, default: () => new Date() })
    created_at: Date;


}


export const GroupsSchema = SchemaFactory.createForClass(Groups);