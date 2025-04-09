import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Roles, Users } from "./users.schema";
import { Model } from "mongoose";

//----------------------------------------------------------------------------//

@Injectable()
export class UsersService {
    constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

//----------------------------------------------------------------------------//

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

//----------------------------------------------------------------------------//

    async findUserByEmail(email: string): Promise<Users | null> {
        return this.userModel.findOne({ email }).exec();
    }
}
