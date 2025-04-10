import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Groups } from "./groups.schema";
import { Model } from "mongoose";
import { GroupUsers, Roles } from "src/groupusers/groupsusers.schema";


@Injectable({})



export class GroupsService{
    constructor(
    @InjectModel(Groups.name) private groupModel: Model<Groups>,
    @InjectModel(GroupUsers.name) private readonly groupUsersModel: Model<GroupUsers>,
) 
    {}

       async createGroup(groupName: string, info: string) : Promise<Groups> {
            const newGroup = new this.groupModel({ 
                groupName, 
                info,
            });
            return await newGroup.save();
        }


        async addOwnerGroup(groupId: string, userId: string, role: Roles): Promise<GroupUsers> {
            const groupUser = new this.groupUsersModel({
                group: groupId,
                user: userId,
                groupRole: role,  
            });
            return await groupUser.save(); 
        }


        async joinGroup(groupId: string, userId: string): Promise<GroupUsers> {

            const existingUser = await this.groupUsersModel.findOne({ 
                group: groupId, 
                user: userId })
                .exec();

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
}


       

        