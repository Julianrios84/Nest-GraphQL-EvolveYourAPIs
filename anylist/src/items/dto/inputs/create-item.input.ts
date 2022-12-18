import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {

  @Field(() => String, { description: '' })
  @IsNotEmpty()
  @IsString()
  name: string;

  // @Field(() => Float, { description: '' })
  // @IsPositive()
  // quantity: number;

  @Field(() => String, { nullable: true,  description: '' })
  @IsString()
  @IsOptional()
  units?: string;
}
