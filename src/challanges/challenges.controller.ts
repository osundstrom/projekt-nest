import { Body, Controller, Post, UseGuards, Request, Param, Get } from "@nestjs/common";
import { ChallangesService } from "./challenges.service";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { Users } from "src/users/users.schema";


@Controller("challenges")

export class challangesController{

    constructor(
        private readonly challangeService: ChallangesService) 
        {}

    @Post("createChallenge/:groupId")
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


    @Get(":challengeId")
    @UseGuards(JwtAuthGuard)
    async getChallangeById(
        @Param("challengeId") challengeId: string,
        @Request() req,
        ) {
            const challenge = await this.challangeService.getChallengeById(challengeId);
            return challenge ;

}
}

