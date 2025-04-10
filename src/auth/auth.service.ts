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
    
            const payload = {userId: oneUser._id};
            const jwtToken = await this.jwtService.signAsync(payload);

            return {jwtToken, payload};
        }
     catch(error) {
        throw new Error(error.message); //fel vid inlogg
    }}

}