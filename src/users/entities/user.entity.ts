import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
  UNSPECIFIED = "unspecified"
}

export enum UserRol {
  USER = "user",
  ADMIN = "admin"

}

@Entity({name:'users'})
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15,unique:true })
  username: string;

  @Column({ type: 'varchar', length: 40, unique:true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'int' })
  age: number;

  @Column({type:'enum',enum:UserRol,default:UserRol.USER})
  rol:UserRol

  @Column({ type: 'enum', enum:UserGender})

  gender: UserGender;

}