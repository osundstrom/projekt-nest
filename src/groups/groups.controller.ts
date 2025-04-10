import { Body, Controller, Delete, Post, UseGuards, Request } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { JwtAuthGuard } from "../guard/jwt.guard"
import { Users } from "src/users/users.schema";
import { GroupUsers, Roles } from 'src/groupusers/groupsusers.schema';
import { Groups } from 'src/groups/groups.schema';

@Controller("groups")

export class GroupController{

    constructor(private groupsService: GroupsService) {}

//--------------------------------------------------------------------------------------------------------------//
    //POST skapa en grupp
    @Post("createGroup")
    @UseGuards(JwtAuthGuard)
    async createGroup(

    @Body() body: { groupName: string, info: string},
    @Request() req,

    ) {
    const user = req.user as Users;
    const { groupName, info } = body;

    const group = await this.groupsService.createGroup(groupName, info);

    await this.groupsService.addOwnerGroup(group._id.toString(), user._id.toString(), Roles.OWNER);

    return { message: "Grupp skapad", group };

    }

//--------------------------------------------------------------------------------------------------------------//
    //POST gå med i en grupp
    @Post("joinGroup")
    @UseGuards(JwtAuthGuard)
    async joinGroup(

    @Body() body: { groupId: string},
    @Request() req,
    ) {
    const user = req.user as Users;
    const { groupId } = body;

    const groupUser = await this.groupsService.joinGroup(groupId, user._id.toString(),);

    return { message: "Användare tillagd i grupp", groupUser };
    }


}

