import { Module } from '@nestjs/common';
import { GroupsService } from "./groups.service";
import { GroupController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Groups, GroupsSchema } from './groups.schema';
import { GroupUsers, UserGroupSchema } from 'src/groupusers/groupsusers.schema';


@Module({
    imports: [
        MongooseModule.forFeature([
          { name: Groups.name, schema: GroupsSchema },
          { name: GroupUsers.name, schema: UserGroupSchema },
        ]),
      ],
    controllers: [GroupController],
    providers: [GroupsService],
})
export class GroupsModule {}
