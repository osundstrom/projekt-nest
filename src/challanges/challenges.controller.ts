import { Body, Controller, Post, UseGuards, Request, Param } from "@nestjs/common";
import { ChallangesService } from "./challenges.service";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { Users } from "src/users/users.schema";


@Controller("challanges")

export class challangesController{

    constructor(
        private readonly challangeService: ChallangesService) 
        {}

    @Post("createChallange/:groupId")
    @UseGuards(JwtAuthGuard)
    async createChallange (
        @Param("groupId") groupId: string,
        @Body() body: {targetSteps: number, challengeName: string},
        @Request() req,
        
        ) {
        
        const userId = req.user._id
        console.log("controller", userId)
        const {targetSteps, challengeName } = body;

        const oneChallange = await this.challangeService.createChallange(groupId, userId, challengeName, targetSteps, );
        
        return {message: "Utmaning skapad", oneChallange}
    }

}

