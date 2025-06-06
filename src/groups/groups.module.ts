import { Module } from '@nestjs/common';
import { GroupsService } from "./groups.service";
import { GroupController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Groups, GroupsSchema } from './groups.schema';
import { GroupUsers, UserGroupSchema } from 'src/groupusers/groupsusers.schema';
import { Challenges, ChallengesSchema } from '../challanges/challenges.schema';
import { ChallengeUsers, ChallengeUsersSchema } from "../challengeusers/challengeusers.schema";


@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Groups.name, schema: GroupsSchema },
          { name: GroupUsers.name, schema: UserGroupSchema },
          {name: Challenges.name, schema: ChallengesSchema},
          {name: ChallengeUsers.name, schema: ChallengeUsersSchema},
        ]),
      ],
    controllers: [GroupController],
    providers: [GroupsService],
})
export class GroupsModule {}
