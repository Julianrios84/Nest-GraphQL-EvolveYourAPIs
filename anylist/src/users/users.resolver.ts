import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { JWtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ValidRoles } from '../auth/enums/valid.roles.enum';
import { ItemsService } from '../items/items.service';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';

@Resolver(() => User)
@UseGuards(JWtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'userUpdate' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'userRemove' })
  async removeUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.remove(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser() currentUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }
}
