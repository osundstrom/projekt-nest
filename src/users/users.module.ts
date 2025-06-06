import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Users.name,
            schema: UsersSchema,
        }])
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],

})
export class UsersModule {}
