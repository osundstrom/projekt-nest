import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Users } from "src/users/users.schema";
import { Groups } from "src/groups/groups.schema";

//Roller för grouprole
export enum Roles {
    USER = "member",
    OWNER = "owner",
}

//schema för en gruppanvändare
@Schema()
export class GroupUsers extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Users", required: true })
    user: Users;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Groups", required: true })
    group: Groups;

    @Prop({required: true, enum: Roles, default: Roles.USER})
    groupRole: Roles; 
}

export const UserGroupSchema = SchemaFactory.createForClass(GroupUsers);