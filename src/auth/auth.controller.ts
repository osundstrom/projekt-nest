import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Roles } from "src/users/users.schema";

@Controller("auth")

export class AuthController{

    constructor(private authService: AuthService) {}

    @Post("register")
    async register(@Body() body: { firstName: string, lastName: string, email: string, password: string, imageUrl: string, role: Roles }) {
        return this.authService.register(body.firstName, body.lastName, body.email, body.password,body.imageUrl, body.role);
    }

    

    @Post("login")
    async login(@Body() body: { email: string, password: string }) {
        return this.authService.login(body.email, body.password);
    }


}