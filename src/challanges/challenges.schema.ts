import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Groups } from 'src/groups/groups.schema';

//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//


@Schema({ collection: "Challenges" })

export class Challenges extends Document {


  @Prop({ required: true })
  targetSteps: number;

  @Prop({ type: Types.ObjectId, ref: "Groups", required: true })
  group: Types.ObjectId;

  @Prop({ default: true })
  status: Boolean; 

  @Prop({ default: () => new Date() })
  createdAt: Date;

}

export const ChallengesSchema = SchemaFactory.createForClass(Challenges);