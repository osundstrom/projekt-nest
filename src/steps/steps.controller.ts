import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { StepsService } from './steps.service';

@Controller("steps")
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post("add")
  @UseGuards(JwtAuthGuard)
  async addStep(
    @Body() body: {
        groupId: string; 
        challangeId: string;
        steps: number },

    @Request() req

  ) {

    const userId = req.user._id;
    const {groupId, challangeId, steps} = body;

    const addedSteps = await this.stepsService.addingSteps(userId, groupId, challangeId, steps);

    return { message: "Lagt till steg", addedSteps };
  }
}