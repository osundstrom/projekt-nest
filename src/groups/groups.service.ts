import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Groups } from "./groups.schema";
import { Model } from "mongoose";
import { GroupUsers, Roles } from "src/groupusers/groupsusers.schema";
import { Challenges } from "src/challanges/challenges.schema";


@Injectable({})



export class GroupsService{
    constructor(
    @InjectModel(Groups.name) private groupModel: Model<Groups>,
    @InjectModel(GroupUsers.name) private readonly groupUsersModel: Model<GroupUsers>,
    @InjectModel(Challenges.name) private readonly challengesModel: Model<Challenges>,
) 
    {}
//--------------------------------SKAPA GRUPP--------------------------------------------------------------------//
       async createGroup(groupName: string, info: string) : Promise<Groups> {
            const newGroup = new this.groupModel({ 
                groupName, 
                info,
            });
            return await newGroup.save();
        }

//---------------------------------LÄGG TILL ÄGARE-------------------------------------------------------------------//
        async addOwnerGroup(groupId: string, userId: string, role: Roles): Promise<GroupUsers> {
            const groupUser = new this.groupUsersModel({
                group: groupId,
                user: userId,
                groupRole: role,  
            });
            return await groupUser.save(); 
        }

//-------------------------------------GÅ MED I GRUPP---------------------------------------------------------------//
        //måste skapa bättre error medd som skickas för felantering senare.- 
        async joinGroup(groupId: string, userId: string): Promise<GroupUsers> {

            const existingUser = await this.groupUsersModel.findOne({ 
                group: groupId, 
                user: userId })
                

                if (existingUser) {
                    throw new Error("Du är redan medlem i denna grupp"); 
                }

                const groupUser = new this.groupUsersModel ({
                    group: groupId,
                    user: userId,
                    groupRole: Roles.USER,
                })

                await this.groupModel.findByIdAndUpdate(groupId, { $inc: { numberMembers: 1 }})

                return await groupUser.save();
        } 



//-------------------------------HÄMTA GRUPPER MEDLEM---------------------------------------------------------------------//

        async getGroupsOfUser(userId: string) {
            const groupsOfUser = await this.groupUsersModel.find({user: userId})
            .populate("group")

            return groupsOfUser.map(one => ({
                group: one.group,
                groupRole: one.groupRole
              }));

        }

//-------------------------------HÄMTA GRUPPER INFO---------------------------------------------------------------------//

        
async getGroupDetails(groupId: string, userId: string): Promise<any> {
    
    const selGroup = await this.groupUsersModel.findOne({ group: groupId, user: userId }).populate("group"); 

    if (!selGroup) {
        throw new Error("Gruppen finns inte eller så är du inte medlem i den");
    }

    return {
        groupId: selGroup.group._id,
        groupName: selGroup.group.groupName,
        info: selGroup.group.info,
        numberMembers: selGroup.group.numberMembers,
        groupRole: selGroup.groupRole,
        totalSteps: selGroup.group.totalSteps,
    };
}

//-------------------------------HÄMTA GRUPP MEDLEMMAR och utmaningar---------------------------------------------------------------------//
async getGroupMembers(groupId: string): Promise<any[]> {
    const groupMembers = await this.groupUsersModel.find({ group: groupId }).populate("user");

    if (!groupMembers || groupMembers.length === 0) {
        throw new Error("Finns inge medlemmar i gruppen");
    }

    

    return groupMembers.map(member => ({
        userId: member.user._id,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        email: member.user.email,
        imageUrl: member.user.imageUrl,
        groupRole: member.groupRole,
        totalSteps: member.totalSteps,
    }));
}

//-------------------------------HÄMTA GRUPP UTMANINGAR---------------------------------------------------------------------//
async getGroupChallenges(groupId: string): Promise<any[]> {
    const groupChallenges = await this.challengesModel.find({ group: groupId })

    

    return groupChallenges.map(challenge => ({
        challengeId: challenge._id,
        challengeName: challenge.challengeName,
        challengeSteps: challenge.targetSteps,
        challengeGroupId: challenge.group,
        challengeStatus: challenge.status,
        challengeCreatedAt: challenge.createdAt,
    }));


}

}
       

        