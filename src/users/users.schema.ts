import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Document } from "mongoose";

//----------------------------------------------------------------------------//
//schema för en användare
export enum Roles {
    USER = "user",
    ADMIN = "admin",
}

//----------------------------------------------------------------------------//
//schema för en användare
@Schema({collection: "users"})
export class Users extends Document {
    @Prop({required: true})
    firstName: string;

    @Prop({required: true})
    lastName: string;

    @Prop({unique: true, required: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({required: false})
    imageUrl?: string;

    @Prop({required: true, enum: Roles, default: Roles.USER})
    role: Roles;

    @Prop({required: true, default: 0 })
    totalSteps: number;

    @Prop({required: true, default: () => new Date() })
    created_at: Date;

   

}


export const UsersSchema = SchemaFactory.createForClass(Users);

//----------------------------------------------------------------------------//

//Prehook för att hasha lösenord
UsersSchema.pre<Users>("save", async function (next) {
    try {
    if (this.isNew || this.isModified("password")) {
        const hashPassword = await bcrypt.hash(this.password, parseInt(process.env.HASH));
        this.password = hashPassword;
    }
    next();
    }catch(error) {
        next(error)
    };
});


