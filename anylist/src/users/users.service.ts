import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from '../auth/dto/inputs';
import { ValidRoles } from '../auth/enums/valid.roles.enum';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleErros(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0)
      return this.userRepository.find(/*{
        relations: {
          lastUpdateBy: true,
        },
      }*/);

    return this.userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
      ////this.handleErros({ code: 'error-001', detail: `${email} not found` });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    user: User,
  ): Promise<User> {
    try {
      const preload = await this.userRepository.preload({
        ...updateUserInput,
        id,
      });
      preload.lastUpdateBy = user;
      if (!preload) throw new NotFoundException(`User with id ${id} not found`);
      return this.userRepository.save(preload);
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async remove(id: string, user: User): Promise<User> {
    const userToRemove = await this.findOneById(id);
    userToRemove.active = false;
    user.lastUpdateBy = user;
    return await this.userRepository.save(userToRemove);
  }

  private handleErros(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    
    this.logger.error(error);
    throw new InternalServerErrorException(`Please check server logs`);
  }
}
