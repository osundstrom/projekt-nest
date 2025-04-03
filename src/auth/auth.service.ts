import { Injectable } from "@nestjs/common";

@Injectable({})


export class AuthService{
    

    register() {
        return "test register"
    }

    login() {
        return "test login"
    }

    


}