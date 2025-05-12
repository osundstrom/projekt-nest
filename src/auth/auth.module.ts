import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "src/strategy/jwt.strategy";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UsersSchema } from "src/users/users.schema";
import { GroupUsers, UserGroupSchema } from "src/groupusers/groupsusers.schema";
import { ChallengeUsers, ChallengeUsersSchema } from "../challengeusers/challengeUsers.schema";
import { GoogleStrategy } from "src/strategy/google.strategy";

@Module({
    imports: [
        UsersModule, 
        PassportModule.register({ defaultStrategy: "jwt" }),
        MongooseModule.forFeature([
            { name: Users.name, schema: UsersSchema}, 
            {name: GroupUsers.name, schema: UserGroupSchema},
            {name: ChallengeUsers.name, schema: ChallengeUsersSchema},
        ]),
            
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
            secret: process.env.JWT_KEY,
            signOptions: { expiresIn: "1h" }, 
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule {}