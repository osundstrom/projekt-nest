import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Groups, GroupsSchema } from 'src/groups/groups.schema';
import { GroupUsers, UserGroupSchema } from 'src/groupusers/groupsusers.schema';
import { challangesController } from './challenges.controller';
import { ChallangesService } from './challenges.service';
import { Challenges, ChallengesSchema } from './challenges.schema';



@Module({
    imports: [
        MongooseModule.forFeature([
        {name: Challenges.name, schema: ChallengesSchema},
        {name: Groups.name, schema: GroupsSchema },
        {name: GroupUsers.name, schema: UserGroupSchema },
        ]),
      ],
    controllers: [challangesController],
    providers: [ChallangesService],
})
export class ChallangesModule {}
