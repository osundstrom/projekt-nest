import { Body, Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../guard/jwt.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  
  @Get("usersteps")
  @UseGuards(JwtAuthGuard) 
  async getTotalSteps(@Request() req) {
    const userId = req.user._id; 
    return this.usersService.getUserSteps(userId); 
}
}