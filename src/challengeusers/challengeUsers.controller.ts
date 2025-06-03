import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt.guard'; 
import { ChallengeUsersService } from './challengeUsers.service'; 

@Controller("challengeusers") 
@UseGuards(JwtAuthGuard) 
export class ChallengeUsersController { 
  constructor(private readonly challengeUsersService: ChallengeUsersService) {} 

  //-------hämta alla utmaningar för en användare-------------------------------//
  @Get("challenge/:challengeId")
  @UseGuards(JwtAuthGuard)
  async getAllChallengeSteps(
    @Param("challengeId") challengeId: string
) { 
    return this.challengeUsersService.getAllChallengeSteps(challengeId);
  }

  //-------lägga till steg -------------------------------//
    @Post(":challengeId/addsteps") 
    @UseGuards(JwtAuthGuard) 
    async addSteps(
    @Param('challengeId') challengeId: string,
    @Body('steps') steps: number, 
    @Request() req,
  ) {
    const userId = req.user._id; 


   
    return this.challengeUsersService.addSteps(userId.toString(), challengeId, steps);
  }
 


 
}