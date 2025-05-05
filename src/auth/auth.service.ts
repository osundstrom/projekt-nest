import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Roles, Users } from "src/users/users.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";





export class AuthService{
    constructor(
        @InjectModel(Users.name) private readonly userModel: Model<Users>,
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

}