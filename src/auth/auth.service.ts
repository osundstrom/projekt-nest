import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Roles } from "src/users/users.schema";

@Injectable({})


export class AuthService{
    constructor(
        private usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {};
    
async register(firstName: string, lastName: string, email: string, password: string, imageUrl: string, role: Roles) {
    try {
        
        const existUser = await this.usersService.findUserByEmail(email);
        if (existUser) {
            throw new Error("Användaren finns redan");
        }
        
        const newUser = await this.usersService.registerUser(firstName, lastName, email, password, imageUrl, role);
        console.log('JWT_KEY:', process.env.JWT_KEY);
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
    
            const oneUser = await this.usersService.findUserByEmail(email);
    
            if (!oneUser) {
                throw new Error("Ogiltig användare");
            }
    
            const passwordMatch = await bcrypt.compare(password, oneUser.password);
            if (!passwordMatch) {
                throw new Error("ogiltiga uppgifter");
            }
    
            const data = {userId: oneUser._id};
            const jwtToken = await this.jwtService.signAsync(data);
            return {jwtToken}
        }
     catch(error) {
        throw new Error(error.message); //fel vid inlogg
    }}

}