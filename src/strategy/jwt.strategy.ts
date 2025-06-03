import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    
    @InjectModel(Users.name) private readonly userModel: Model<Users>
  ) {
    super({ 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY, //från .env filen
    });
  }

  //---------------------------------validate--------------------------------------------------//
  async validate(payload: any): Promise<Users> {
    
    //söker efter användaren med det id som finns i payload
    const user = await this.userModel.findById(payload.userId).select("firstName lastName email totalSteps imageUrl");
    console.log(user);
    if (!user) {
      throw new Error("användare finns inte");
    }

    return  user ; //returnerar användaren
  }
}