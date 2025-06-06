import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Roles, Users } from "src/users/users.schema";
import * as fs from 'fs';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { GroupUsers } from "src/groupusers/groupsusers.schema";
import { ChallengeUsers } from "../challengeusers/challengeusers.schema";




@Injectable()
export class AuthService{
    constructor(
        @InjectModel(Users.name) private readonly userModel: Model<Users>,
        @InjectModel(GroupUsers.name) private readonly groupUsersModel: Model<GroupUsers>,
        @InjectModel(ChallengeUsers.name) private readonly challengeUsersModel: Model<ChallengeUsers>,
        private usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {};

//-------------------------------Register--------------------------------------------------//
async register(
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string, 
    imageUrl: string | null,
    role: Roles
    ) {

    try { //kontrollera 
        if (!email.includes('@')) {
            throw new BadRequestException("E-postadressen måste innehålla ett @.");
        }

        if (password.length < 7) {
            throw new BadRequestException("Lösenordet måste vara minst 7 tecken långt.");
        }
        if (!/[A-Z]/.test(password)) {
            throw new BadRequestException("Lösenordet måste innehålla minst en stor bokstav.");
        }
        if (!/[0-9]/.test(password)) {
            throw new BadRequestException("Lösenordet måste innehålla minst en siffra.");
        }
        
        const existUser = await this.userModel.findOne({email}); //kontrollera om användaren finns
        if (existUser) {
            throw new BadRequestException("Användaren finns redan");
        }
        
        
        const newUser = await this.usersService.registerUser(firstName, lastName, email, password, imageUrl, role);
        return {
            userId: newUser._id,
            email: newUser.email,
        };

    } catch (error) {
        if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
            throw error;
        }
       
        console.error(error); 
        throw new InternalServerErrorException(" serverfel vid registrering");
    }
}

//----------------------------------------------------------------------------------//

//----------------------Login-------------------------------------------------------//
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
            
            //payload 
            const payload = {userId: oneUser._id, name: oneUser.firstName + " " + oneUser.lastName, email: oneUser.email, imageUrl: oneUser.imageUrl};
            const jwtToken = await this.jwtService.signAsync(payload);

            return {jwtToken, payload};
        }
     catch(error) {
        throw new Error(error.message); //fel vid inlogg
    }}

    //----------------------------Uppdatera bild------------------------------------------------------//

    async updateUserImage(userId: string, imageUrl: string) {
        try {
            const user = await this.userModel.findByIdAndUpdate(userId, { imageUrl }, { new: true });
            return {imageUrl: user.imageUrl};
        } catch (error) {
            throw new Error("Kunde inte uppdatera profilbilden");
        }
    }

    //--------------------------------Updatera användare--------------------------------------------------//

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

//------------------------------Radera användare----------------------------------------------------//

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

//-----------------------------validra oauth-----------------------------------------------------//
    async validateOAuthLogin(user: any) {
        const { googleId, email, firstName, lastName, imageUrl } = user;

        if (!googleId) { // Kontrollera om googleId finns
        console.error("googleId saknas");
        throw new InternalServerErrorException("Kunde inte hämta nödvändig information från Google");
    }

        const existingUser = await this.userModel.findOne({ googleId });

        if (existingUser) { // Om användaren redan finns
            return existingUser;
        }

        // Skapa en ny användare
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

//-----------------------------Login OAuth-----------------------------------------------------//
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