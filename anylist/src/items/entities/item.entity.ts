import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: '' })
  id: string;

  @Column()
  @Field(() => String, { description: '' })
  name: string;

  // @Column()
  // @Field(() => String, { description: '' })
  // quantity: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true, description: '' })
  units?: string;

  // Relations
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true})
  @Index('user-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem])
  listItem: ListItem[]
}
