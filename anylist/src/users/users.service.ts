import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { SignupInput } from '../auth/dto/inputs';


@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });
      return await this.userRepository.save(user)
    } catch (error) {
      this.handleErros(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({email})
    } catch (error) {
      throw new NotFoundException(`${email} not found`)
      // this.handleErros({ code: 'error-001', detail: `${email} not found` });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({id})
    } catch (error) {
      throw new NotFoundException(`${id} not found`)
    }
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: string): Promise<User> {
    throw new Error(`remove not implemented.`)
  }

  private handleErros(error: any): never {
    if(error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''))
    }

    if(error.code === 'error-001'){
      throw new BadRequestException(error.detail.replace('Key', ''))
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Please check server logs`)
  }
}
