import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRol } from "./entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:false,
      secretOrKey: process.env.SECRET || 'secret'
    })
  }

  async validate(payload: {id: number;username: string;email: string,rol:UserRol}){
    return {userId:payload.id, username:payload.username, email:payload.email,rol:payload.rol}
  }
}

