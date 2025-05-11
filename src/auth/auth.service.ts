import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Roles, Users } from "src/users/users.schema";
import * as fs from 'fs';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GroupUsers } from "src/groupusers/groupsusers.schema";
import { ChallengeUsers } from "src/challengeUsers/challengeUsers.schema";





export class AuthService{
    constructor(
        @InjectModel(Users.name) private readonly userModel: Model<Users>,
        @InjectModel(GroupUsers.name) private readonly groupUsersModel: Model<GroupUsers>,
        @InjectModel(ChallengeUsers.name) private readonly challengeUsersModel: Model<ChallengeUsers>,
        private usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {};
    
async register(
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string, 
    imageUrl: string, 
    role: Roles
    ) {

    try {
        
        const existUser = await this.userModel.findOne({email});
        if (existUser) {
            throw new Error("Användaren finns redan");
        }
        
        const newUser = await this.usersService.registerUser(firstName, lastName, email, password, imageUrl, role);
        return {
            userId: newUser._id,
            email: newUser.email,
        };

    } catch (error) {
        throw new Error(error.message); //fel vid reg
    }
}

//----------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------//
      async login(email: string, password: string) {
        try {
    
            const oneUser = await this.userModel.findOne({email: email.toLowerCase().trim()});
    
            if (!oneUser) {
                throw new Error("Ogiltig användare");
            }
    
            const passwordMatch = await bcrypt.compare(password, oneUser.password);
            if (!passwordMatch) {
                throw new Error("ogiltiga uppgifter");
            }
    
            const payload = {userId: oneUser._id, name: oneUser.firstName + " " + oneUser.lastName, email: oneUser.email, imageUrl: oneUser.imageUrl};
            const jwtToken = await this.jwtService.signAsync(payload);

            return {jwtToken, payload};
        }
     catch(error) {
        throw new Error(error.message); //fel vid inlogg
    }}

    //----------------------------------------------------------------------------------//

    async updateUserImage(userId: string, imageUrl: string) {
        try {
            const user = await this.userModel.findByIdAndUpdate(userId, { imageUrl }, { new: true });
            return {imageUrl: user.imageUrl};
        } catch (error) {
            throw new Error("Kunde inte uppdatera profilbilden");
        }
    }

    //----------------------------------------------------------------------------------//

    async updateUser(userId: string, firstName: string, lastName: string, email: string) {
        try {
           
            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                { firstName, lastName, email },
                { new: true } 
            );
    
            if (!updatedUser) {
                throw new Error("Användare finns inte");
            }
    
            return {
                message: "Uppdaterad",
                user: {
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                },
            };
        } catch (error) {
            throw new Error("Kunde inte uppdatera");
        }
    }

//------------------------------Radera----------------------------------------------------//

    async deleteUser(userId: string) {
        
            const deleteThisUser = await this.userModel.findById(userId);

            if (!deleteThisUser) {
                console.log("Användare finns inte");
            }

            try {
                if(deleteThisUser.imageUrl) {
                    const imagePath = `./uploads/${deleteThisUser.imageUrl.split("/").pop()}`;
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log("Bild borttagen");
                    }else {
                        console.log("Ingen bild att ta bort");
                    }

                }

                await this.groupUsersModel.deleteMany({ user: userId });

                await this.challengeUsersModel.deleteMany({ user: userId});
                
                await this.userModel.findByIdAndDelete(userId);


            return { message: "Användare borttagen" };
        } catch (error) {
            console.error(error);
        }
    }

//----------------------------------------------------------------------------------//
    async validateOAuthLogin(user: any) {
        const { googleId, email, firstName, lastName, imageUrl } = user;

        const existingUser = await this.userModel.findOne({ googleId });

        if (existingUser) {
            return existingUser;
        }

        user = await this.userModel.findOne({ email });
        if (user) {
            user.googleId = googleId;
            user.firstName = firstName;
            user.lastName = lastName;
            user.imageUrl = imageUrl;
            user.role = Roles.USER;
            await user.save();
            return user;
        }

        const newUser = await this.userModel.create({
            googleId,
            email,
            firstName,
            lastName,
            imageUrl,
        });

        return newUser;
    }


    async loginOAuthUser(user: Users): Promise<{ token: string, payload: any }> {
        
        if (!user || !user._id) {
            throw new Error("Användare saknas");
        }

        const onePayload = {
            userId: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName, 
            lastName: user.lastName,   
            imageUrl: user.imageUrl,  
        };

        const jwtServiceSend = await this.jwtService.signAsync(onePayload);


        return {
            token: jwtServiceSend,
            payload: onePayload,
        };
    }


}