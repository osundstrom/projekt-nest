import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Roles, Users } from "./users.schema";
import { Model } from "mongoose";

//----------------------------------------------------------------------------//

@Injectable()
export class UsersService {
    constructor(
        
    @InjectModel(Users.name) private userModel: Model<Users>
    ) {}

//----------------------------------------------------------------------------//
    //regristrera en användare
    async registerUser(firstName: string, lastName: string, email: string, passwordInput: string, imageUrl: string | null, role: Roles = Roles.USER): Promise<Users> {
        try {

        const newUser: Partial<Users> = { 
            firstName, 
            lastName, 
            email: email.toLowerCase().trim(), 
            password: passwordInput,
            imageUrl,
            role,
        };
        console.log(newUser.role);
        const newUserDocument = new this.userModel(newUser);
        return await newUserDocument.save();
    }
        catch (error) {
            console.error("Error registering user:", error);
            throw new Error("Kunde inte registrera användaren");
        }
    }

//----------------------------------------------------------------------------//

async getUserSteps(userId: string): Promise<number> {
    
    const user = await this.userModel.findById(userId).select("totalSteps");
    if (!user) {
        throw new Error("användare finns inte");
    }
    return user.totalSteps;
}

//----------------------------------------------------------------------------//
    

}
