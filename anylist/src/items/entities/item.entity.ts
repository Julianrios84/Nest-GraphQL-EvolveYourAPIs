import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: '' })
  id: string;

  @Column()
  @Field(() => String, { description: '' })
  name: string;

  @Column()
  @Field(() => String, { description: '' })
  quantity: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true, description: '' })
  units?: string;

}
