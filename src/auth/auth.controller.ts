import { Body, Request, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, Put, Patch, Delete, Req, Res, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Roles } from "src/users/users.schema";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { RegisterUserDto } from "./dto/RegisterUserDto";
import { LoginUserDto } from "./dto/LoginUserDto";
import { UpdateUserDto } from "./dto/updateUSerDto";



@Controller("auth")

export class AuthController {

    constructor(private authService: AuthService) { }

    @Post("register")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "./uploads",
                filename: (req, file, callback) => {
                    const imageName = "imageProfile"
                    const timeDate = Date.now();
                    const fileType = file.originalname.split(".").pop();
                    callback(null, `${imageName}-${timeDate}.${fileType}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return callback(new Error("Endast bildfiler är tillåtna"), false);
                }
                callback(null, true);
            }
        }),
    )

    async register(@Body() registerUserDto: RegisterUserDto ,
        @UploadedFile() file: Express.Multer.File) {
        const imageUrl = file ? `/uploads/${file.filename}` : null;
        return this.authService.register(registerUserDto.firstName, registerUserDto.lastName, registerUserDto.email, registerUserDto.password, imageUrl, registerUserDto.role);
    }



    @Post("login")
    async login(@Body() body: { email: string, password: string }) {
        const user = await this.authService.login(body.email, body.password);
        return user;
    }




    @Patch("updateuserimage")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: "./uploads",
                filename: (req, file, callback) => {
                    const imageName = "imageProfile"
                    const timeDate = Date.now();
                    const fileType = file.originalname.split(".").pop();
                    callback(null, `${imageName}-${timeDate}.${fileType}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return callback(new Error("Endast bildfiler är tillåtna"), false);
                }
                callback(null, true);
            }
        }),)

    async updateUserImage(
        @UploadedFile() file: Express.Multer.File,
        @Request() req) {
        const userId = req.user._id;
        const imageUrl = file ? `/uploads/${file.filename}` : null;
        return this.authService.updateUserImage(userId, imageUrl);
    }


    @Patch("updateUser")
    @UseGuards(JwtAuthGuard)
    async updateUser(
        @Body() body: { firstName: string; lastName: string; email: string },
        @Request() req
    ) {
        const userId = req.user._id;
        const { firstName, lastName, email } = body;

        return this.authService.updateUser(userId, firstName, lastName, email);
    }

    @Delete("deleteUser")
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Request() req) {
        const userId = req.user._id;
        return this.authService.deleteUser(userId);
    }



    //----- google login  oauth-------------------------------------------------------------//
    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth(@Req() req) {
        // startar OAuth (google inloggning)
    }


    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const user = req.user;
        if (!user) {
            console.log("Ingen användare hittades");
            return res.redirect(`http://localhost:5173/login?error=no_user`); //error url
        }
        try {
            // skapa JWT
            const data = await this.authService.loginOAuthUser(user);
            if (data.payload && data.token) {
                const token = data.token;
                const payload = data.payload;
                const encodedPayload = encodeURIComponent(JSON.stringify(payload));
                res.redirect(`http://localhost:5173/oauth/login?token=${token}&payload=${encodedPayload}`);
            }
            else {
                console.log("fel vid inloggning");
                return res.redirect(`http://localhost:5173/login?error=oauth_error`); //error url
            }
        } catch (error) {
            console.error("oväntat fel", error);
            return res.redirect(`http://localhost:5173/login?error=oauth_error`); //error url
        }

    }
}