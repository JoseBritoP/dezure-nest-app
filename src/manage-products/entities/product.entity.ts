import { User } from "src/users/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity({name:'posts'})
export class Product {

  @PrimaryGeneratedColumn()
  id:number

  @Column({type:'varchar', length:'30'})
  name:string

  @Column({type:'int'})
  price:number

  @Column({type:'boolean',default:true})
  inStock:boolean

  @Column()
  creatorId:number
  
  @ManyToOne(()=> User, user => user.products)
  creator:User
}
