import { Groups } from "src/groups/groups.schema";
import { GroupUsers, Roles } from "src/groupusers/groupsusers.schema";
import { Challenges } from "./challenges.schema";
import { Model, Types } from "mongoose";
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


//-----------------------------------Kontrollera roll-----------------------------------------------------------------//

async checkGroupRole(group: string, user: string): Promise<boolean> {
  console.log("groupId:", group);
  console.log("userId:", user);


    const groupOwner = await this.groupUsersModel.findOne({ group, user});
    console.log("groupOwner:", groupOwner);

   

    return groupOwner && groupOwner.groupRole === Roles.OWNER;
}

//--------------------------------Skapa utmaning--------------------------------------------------------------------//

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

//-----------------------------------Hämta utmaning-----------------------------------------------------------------//
async getChallengeById(challengeId: string): Promise<Challenges> {

    const challenge = await this.challangeModel.findById(challengeId);

    if (!challenge) {
        throw new Error("Utmaing hittas ej");
    }

    return challenge;

  }

  //------------------------------------------Uppdatera status----------------------------------------------------------//

  async updateChallengeStatus(
    challengeId: string, 
    userId: string, 
    newStatus: boolean,): 
    Promise<Challenges> {

    const challengeIdObject = new Types.ObjectId(challengeId);
    const userIdObject = new Types.ObjectId(userId);


    const challenge = await this.challangeModel.findById(challengeIdObject);
    if (!challenge) {
      throw new Error("Utmaning hittas ej");
    }

    const groupId = challenge.group.toString();
    const groupObjectId = new Types.ObjectId(groupId);

    const memberGroup = await this.groupUsersModel.findOne({
      user: userIdObject,
      group: groupObjectId,
    });

    if (!memberGroup) {
      throw new Error("Användare är ej med i denna grupp");
    }

    const updatedChallenge = await this.challangeModel.findByIdAndUpdate(
      challengeIdObject,
      { $set: { status: newStatus }},
      { new: true }
    );

    return updatedChallenge;
    
}

}