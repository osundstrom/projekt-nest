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
    async registerUser(firstName: string, lastName: string, email: string, password: string, imageUrl: string, role: Roles = Roles.USER) {

        const newUser = new this.userModel({ 
            firstName, 
            lastName, 
            email: email.toLowerCase(), 
            password,
            imageUrl,
            role,
        });
        console.log(newUser.role);
        return newUser.save();
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
