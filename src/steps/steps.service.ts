import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Steps } from "./steps.schema";
import { Model, Types } from "mongoose";
import { Challenges } from "src/challanges/challenges.schema";
import { Users } from "src/users/users.schema";
import { Groups } from "src/groups/groups.schema";
import { GroupUsers } from "src/groupusers/groupsusers.schema";

@Injectable()
export class StepsService {
  constructor(
    @InjectModel(Steps.name) private stepsModel: Model<Steps>,
    @InjectModel(Challenges.name) private challengesModel: Model<Challenges>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(Groups.name) private groupsModel: Model<Groups>,
    @InjectModel(GroupUsers.name) private groupUsersModel: Model<GroupUsers>,
  ) {}

    async addingSteps( 
        userId: string,
        groupId: string,
        challangeId: string,
        steps: number
    ): Promise<Steps> {

    const checkUser = await this.groupUsersModel.findOne({
        user: userId,
        group: groupId,
    });
    if (!checkUser) {
        throw new ForbiddenException("Användare ej med i denna grupp");
    }

    const checkChallenge = await this.challengesModel.findOne({
        _id: challangeId,
        group: groupId,
      });
      if (!checkChallenge) {
        throw new ForbiddenException("Utmaning tillhör ej denna grupp");
      }

    const newStep = new this.stepsModel({
      user: new Types.ObjectId(userId),
      group: new Types.ObjectId(groupId),
      challenge: new Types.ObjectId(challangeId),
      steps,
    });

    const saveSteps = await newStep.save();

    const challangesSteps = await this.challengesModel.updateOne(
        {_id: new Types.ObjectId(challangeId)},
        {$inc: {totalSteps: steps }}
    );

    const userSteps = await this.usersModel.updateOne(
        {_id: new Types.ObjectId(userId)},
        {$inc: {totalSteps: steps }}
    );

    const groupSteps = await this.groupsModel.updateOne(
        {_id: new Types.ObjectId(groupId)},
        {$inc: {totalSteps: steps}}
    );

    await this.groupUsersModel.updateOne(
        { user: userId, group: groupId },
        { $inc: { totalSteps: steps } }
      );

    console.log(challangeId, challangesSteps)
    console.log(userId, userSteps)
    console.log(groupId, groupSteps)

return saveSteps;

}}

//använder ej denna längre?, hämtar ej forntend. 