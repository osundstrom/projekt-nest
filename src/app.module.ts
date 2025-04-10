import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { GroupusersModule } from './groupusers/groupusers.module';
import { StepsModule } from './steps/steps.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ChallangesModule } from "./challanges/challenges.module";



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,}),
    AuthModule, 
    UsersModule, 
    GroupsModule, 
    GroupusersModule, 
    StepsModule, 
    ChallangesModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
  ],
})

export class AppModule {}
