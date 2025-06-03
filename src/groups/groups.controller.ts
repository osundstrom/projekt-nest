import { Body, Controller, Delete, Post, UseGuards, Request, Get, Param } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { JwtAuthGuard } from "../guard/jwt.guard"
import { Users } from "src/users/users.schema";
import { GroupUsers, Roles } from 'src/groupusers/groupsusers.schema';
import { Groups } from 'src/groups/groups.schema';
import { CreateGroupDto } from './dto/createGroup.dto'; 
import { JoinGroupDto } from './dto/JoinGroupDto'; 


@Controller("groups")

export class GroupController{

    constructor(private groupsService: GroupsService) {}

//--------------------------------------------------------------------------------------------------------------//
    //POST skapa en grupp
    @Post("createGroup")
    @UseGuards(JwtAuthGuard)
    async createGroup(

    @Body() createGroupDto: CreateGroupDto, 
    @Request() req,

    ) {
    const user = req.user as Users;
    const { groupName, info } = createGroupDto;

    const group = await this.groupsService.createGroup(groupName, info);

    await this.groupsService.addOwnerGroup(group._id.toString(), user._id.toString(), Roles.OWNER);

    return { message: "Grupp skapad", group };

    }

//--------------------------------------------Gå med i grupp------------------------------------------------------------------//
    @Post("joinGroup")
    @UseGuards(JwtAuthGuard)
    async joinGroup(

    @Body() joinGroupDto: JoinGroupDto, 
    @Request() req,
    ) {
    const user = req.user as Users;
    const { groupId } = joinGroupDto; 

    const groupUser = await this.groupsService.joinGroup(groupId, user._id.toString(),);

    return { message: "Användare tillagd i grupp", groupUser };
    }
//--------------------------------------Grupper medlem i------------------------------------------------------------------------//
    @Get("myGroups")
    @UseGuards(JwtAuthGuard)
    async getGroupsOfUser(
        @Request() req) {
        const userId = req.user._id;
        const groups = await this.groupsService.getGroupsOfUser(userId);
        return { message: "Hämtade grupper", groups };
      }
//--------------------------------------Hämta gruppinfo------------------------------------------------------------------------//
    @Get(":groupId")
    @UseGuards(JwtAuthGuard) 
    async getGroupDetails(
        @Param("groupId") groupId: string, 
        @Request() req) {
        const userId = req.user._id;
        return this.groupsService.getGroupDetails(groupId, userId);
}

//--------------------------------------Hämta gruppmedlemmar------------------------------------------------------------------//
@Get(":groupId/members")
  @UseGuards(JwtAuthGuard) 
  async getGroupMembers(
    @Param("groupId") groupId: string, 
    @Request() req) {
    const userId = req.user._id; 
    
    return this.groupsService.getGroupMembers(groupId);
  }
  
//--------------------------------------Hämta grupputmaningar------------------------------------------------------------------//
  @Get(":groupId/challenges")
  @UseGuards(JwtAuthGuard) 
  async getGroupChallenges(@Param("groupId") groupId: string) {
    return this.groupsService.getGroupChallenges(groupId);
  }


//----------------------------------------Radera hrupp----------------------------------------------------------------------//

@Delete(":groupId/delete")
    @UseGuards(JwtAuthGuard)
    async deleteGroup(
        @Param("groupId") groupId: string,
        @Request() req,
    ) {
        const userId = req.user._id; 
        return this.groupsService.deleteGroup(groupId, userId.toString());
    }

//---------------------------------------Lämna gruppp-----------------------------------------------------------------------//
@Delete(":groupId/leave")
    @UseGuards(JwtAuthGuard)
    async leaveGroup(
        @Param("groupId") groupId: string,
        @Request() req,
    ) {
        const userId = req.user._id; 
        return this.groupsService.leaveGroup(groupId, userId.toString());
    }
}

