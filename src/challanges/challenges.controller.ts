import { Body, Controller, Post, UseGuards, Request, Param, Get, Patch } from "@nestjs/common";
import { ChallangesService } from "./challenges.service";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { Users } from "src/users/users.schema";
import { CreateChallengeDto } from "./dto/createChallange.Dto";


@Controller("challenges")

export class challangesController{

    constructor(
        private readonly challangeService: ChallangesService) 
        {}

//---------------------------------Skapaa utmaning-------------------------------------------------------------------//
    @Post("createChallenge/:groupId")
    @UseGuards(JwtAuthGuard)
    async createChallange (
        @Param("groupId") groupId: string,
        @Body() CreateChallengeDto: CreateChallengeDto,
        @Request() req,
        
        ) {
        
        const userId = req.user._id
        console.log("controller", userId)
        //const {targetSteps, challengeName } = body;

        const oneChallange = await this.challangeService.createChallange(groupId, userId, CreateChallengeDto.challengeName, CreateChallengeDto.targetSteps, );
        
        return {message: "Utmaning skapad", oneChallange}
    }

//----------------------------------------Hämta utmaning------------------------------------------------------------//
    @Get(":challengeId")
    @UseGuards(JwtAuthGuard)
    async getChallangeById(
        @Param("challengeId") challengeId: string,
        @Request() req,
        ) {
            const challenge = await this.challangeService.getChallengeById(challengeId);
            return challenge ;

        }

//------------------------------------------Ändra status----------------------------------------------------------//
    @Patch(":challengeId/status")
    @UseGuards(JwtAuthGuard)
    async updateChallangeStatus(
        @Param("challengeId") challengeId: string,
        @Body() body: { status: boolean },
        @Request() req,
        ) {
            const userId = req.user._id
            const { status } = body;
            const updatedChallange = await this.challangeService.updateChallengeStatus(challengeId, userId, status);
            return { message: "Utmaningens status uppdaterad", updatedChallange };
        }
   


}

