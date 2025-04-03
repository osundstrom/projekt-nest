import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { GroupusersModule } from './groupusers/groupusers.module';
import { ActivitiesModule } from './activities/activities.module';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    GroupsModule, 
    GroupusersModule, 
    ActivitiesModule, 
    MongooseModule.forRoot(process.env.MONGO_URL)
  ],
})

export class AppModule {}
