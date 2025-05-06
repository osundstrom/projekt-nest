import { Body, Request, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, Put, Patch, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Roles } from "src/users/users.schema";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";


@Controller("auth")

export class AuthController{

    constructor(private authService: AuthService) {}

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

    async register(@Body() body: { firstName: string, lastName: string, email: string, password: string, role: Roles }, 
    @UploadedFile() file: Express.Multer.File) {
        const imageUrl = file ? `/uploads/${file.filename}` : null; 

        return this.authService.register(body.firstName, body.lastName, body.email, body.password, imageUrl, body.role);
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
        }), )

        async updateUserImage( 
            @UploadedFile() file: Express.Multer.File,
            @Request() req  ) { 
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

}