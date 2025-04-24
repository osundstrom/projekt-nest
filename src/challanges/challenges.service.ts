import { Groups } from "src/groups/groups.schema";
import { GroupUsers, Roles } from "src/groupusers/groupsusers.schema";
import { Challenges } from "./challenges.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

//----------------------------------------------------------------------------------------------------//


@Injectable()
export class ChallangesService {
  constructor(
    @InjectModel(Challenges.name) private challangeModel: Model<Challenges>,
    @InjectModel(GroupUsers.name) private groupUsersModel: Model<GroupUsers>,
    @InjectModel(Groups.name) private groupModel: Model<Groups>
  ) {}


//----------------------------------------------------------------------------------------------------//

//måste skapa bättre error medd som skickas för felantering senare.- 
async checkGroupRole(group: string, user: string): Promise<boolean> {
  console.log("groupId:", group);
  console.log("userId:", user);


    const groupOwner = await this.groupUsersModel.findOne({ group, user});
    console.log("groupOwner:", groupOwner);

   

    return groupOwner && groupOwner.groupRole === Roles.OWNER;
}

//----------------------------------------------------------------------------------------------------//

//måste skapa bättre error medd som skickas för felantering senare.- 
async createChallange(
  groupId: string, 
  userId: string, 
  challengeName: string,
  targetSteps: number): 
  Promise<Challenges> {
    

    const owner = await this.checkGroupRole(groupId, userId);

    if(!owner) {
        throw new Error("Endast ägaren av gruppen kan skapa en utmaning")
    }

    const oneChallange = new this.challangeModel({
        challengeName,
        targetSteps,
        group: groupId,
        status: true,
    })
    
    return await oneChallange.save()
}


async getChallengeById(challengeId: string): Promise<Challenges> {

    const challenge = await this.challangeModel.findById(challengeId);

    if (!challenge) {
        throw new Error("Utmaing hittas ej");
    }

    return challenge;

  }
}