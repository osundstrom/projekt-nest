import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Collection, Document, Schema as MongooseSchema } from "mongoose";
import { Users } from "src/users/users.schema";
import { Challenges } from "src/challanges/challenges.schema";



//schema för en användare i en utmaning
@Schema( { collection: "ChallengeUsers" } )

export class ChallengeUsers extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Users", required: true })
    user: Users;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Challenges", required: true })
    challenge: Challenges;

    @Prop({required: true,  default: 0})
    stepsTaken: number; 

    @Prop({default: () => new Date() })
    created_at: number;
}

export const ChallengeUsersSchema = SchemaFactory.createForClass(ChallengeUsers);