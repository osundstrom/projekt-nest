import { Body, Controller, Get, UseGuards, Request, Patch, UseInterceptors, Post } from "@nestjs/common";
import { JwtAuthGuard } from "../guard/jwt.guard";
import { UsersService } from "./users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

// ----------------------------steg---------------------------------------------------------//
  @Get("usersteps")
  @UseGuards(JwtAuthGuard) 
  async getTotalSteps(@Request() req) {
    const userId = req.user._id; 
    return this.usersService.getUserSteps(userId); 
}



}