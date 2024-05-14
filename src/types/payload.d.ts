import { UserRol } from "src/users/entities/user.entity";

export type UserType = {
  id: number;
  username: string;
  email: string;
  rol: UserRol;
}

export type ReqUser = {
  user:UserType
}