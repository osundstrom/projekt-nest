import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//

@Schema({collection: "steps"})
export class Steps extends Document {
    @Prop({ type: Types.ObjectId, ref: "Users", required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Groups", required: true })
    group: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Challenges", required: true })
    challenge: Types.ObjectId

    @Prop({required: true})
    steps: number;

    @Prop({required: true, default: () => new Date() })
    created_at: Date;


}


export const StepsSchema = SchemaFactory.createForClass(Steps);