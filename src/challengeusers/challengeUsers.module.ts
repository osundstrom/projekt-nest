import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeUsers, ChallengeUsersSchema } from "./challengeusers.schema";
import { ChallengeUsersService } from './challengeUsers.service';
import { Challenges, ChallengesSchema } from 'src/challanges/challenges.schema';
import { Users, UsersSchema } from 'src/users/users.schema';
import { Groups, GroupsSchema } from 'src/groups/groups.schema';
import { GroupUsers, UserGroupSchema } from 'src/groupusers/groupsusers.schema';
import { ChallengeUsersController } from './challengeUsers.controller';



@Module({
  imports: [
    MongooseModule.forFeature([
        { name: ChallengeUsers.name, schema: ChallengeUsersSchema },
      { name: Challenges.name, schema: ChallengesSchema },
      { name: Users.name, schema: UsersSchema },
      { name: Groups.name, schema: GroupsSchema },
      { name: GroupUsers.name, schema: UserGroupSchema },


    ]),
  ],
  providers: [ChallengeUsersService], 
  controllers: [ChallengeUsersController], 
  exports: [ChallengeUsersService], 
})
export class ChallengeUsersModule {}