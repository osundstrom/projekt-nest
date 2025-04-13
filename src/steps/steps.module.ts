import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Steps, StepsSchema } from './steps.schema';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { Challenges, ChallengesSchema } from 'src/challanges/challenges.schema';
import { Users, UsersSchema } from 'src/users/users.schema';
import { Groups, GroupsSchema } from 'src/groups/groups.schema';
import { GroupUsers, UserGroupSchema } from 'src/groupusers/groupsusers.schema';

@Module({imports: [

    MongooseModule.forFeature([
        { name: Steps.name, schema: StepsSchema },
        { name: Challenges.name, schema: ChallengesSchema},
        { name: Users.name, schema: UsersSchema },
        { name: Groups.name, schema: GroupsSchema },
        { name: GroupUsers.name, schema: UserGroupSchema },


      ])

],

controllers: [StepsController],
providers: [StepsService],})


export class StepsModule {}
