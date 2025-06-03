import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChallengeUsers } from './challengeusers.schema';
import { Users } from 'src/users/users.schema';
import { Challenges } from 'src/challanges/challenges.schema';
import { GroupUsers } from 'src/groupusers/groupsusers.schema';
import { Groups } from 'src/groups/groups.schema';


@Injectable()
export class ChallengeUsersService {
    constructor(
        @InjectModel(ChallengeUsers.name) private challengeUsersModel: Model<ChallengeUsers>,
        @InjectModel(Challenges.name) private challengesModel: Model<Challenges>,
        @InjectModel(Users.name) private usersModel: Model<Users>,
        @InjectModel(Groups.name) private groupsModel: Model<Groups>,
        @InjectModel(GroupUsers.name) private groupUsersModel: Model<GroupUsers>,
    ) { }


    //---------------------------------------hämta steg för användare i utmning-----------------------------------------------------------------------------//
    async getAllChallengeSteps(challengeId: string): Promise<{ user: Partial<Users>, stepsTaken: number }[]> {
        const challengeObjectId = new Types.ObjectId(challengeId);
        const results = await this.challengeUsersModel
            .find({ challenge: challengeObjectId })
            .populate<{ user: Users }>("user", "firstName lastName email imageUrl")
            .sort({ stepsTaken: -1 }) //sortera

        if (!results || results.length === 0) {
            return []; //om tom lista
        }

        return results.map(chalUse => {

            const userDetails = chalUse.user ? {
                firstName: chalUse.user.firstName,
                lastName: chalUse.user.lastName,
                email: chalUse.user.email,
                imageUrl: chalUse.user.imageUrl,
            } : null;

            return {
                user: userDetails,
                stepsTaken: chalUse.stepsTaken,
            };
        })
    }


    //---------------------------------------lägg till steg-----------------------------------------------------------------------------//
    async addSteps(
        userId: string,
        challengeId: string,
        steps: number
    ): Promise<ChallengeUsers> {

        const userObjectId = new Types.ObjectId(userId);
        const challengeObjectId = new Types.ObjectId(challengeId);


        const challenge = await this.challengesModel.findById(challengeObjectId);

        if (!challenge) {
            throw new NotFoundException(`${challengeId} hittas ej`);
        }

        const groupId = challenge.group.toString();
        const groupObjectId = new Types.ObjectId(groupId);

        const checkUserInGroup = await this.groupUsersModel.findOne({
            user: userObjectId,
            group: groupObjectId,
        });

        if (!checkUserInGroup) {
            throw new ForbiddenException("Använde är ej med i denan grupp");
        }



        // uppdterar steg eller skapar en ny ChallengeUser i utmaningen
        const updatedChallengeUserSteps = await this.challengeUsersModel.findOneAndUpdate(
            { user: userObjectId, challenge: challengeObjectId },
            {
                $inc: { stepsTaken: steps },
                $setOnInsert: { user: userObjectId, challenge: challengeObjectId },
            },
            {
                upsert: true,
                new: true,
            }

        );


        // Uppdatera totalSteps i användare och grupp
        const userStepsUpdateResult = await this.usersModel.updateOne(
            { _id: userObjectId },
            { $inc: { totalSteps: steps } }
        );
        // Uppdatera totalSteps i gruppen
        const groupStepsUpdateResult = await this.groupsModel.updateOne(
            { _id: groupObjectId },
            { $inc: { totalSteps: steps } }
        );
        // Uppdatera totalSteps i groupUsers
        await this.groupUsersModel.updateOne(
            { user: userObjectId, group: groupObjectId },
            { $inc: { totalSteps: steps } }
        );

        console.log(userId, userStepsUpdateResult);
        console.log(groupId, groupStepsUpdateResult);
        return updatedChallengeUserSteps;
    }


}