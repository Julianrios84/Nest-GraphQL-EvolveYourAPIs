import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth.response.type';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UsersService, private readonly JwtServices: JwtService) {}

  private generatedToken(id: string) {
    return this.JwtServices.sign({ id });
  }

  async signUp(signupInput: SignupInput): Promise<AuthResponse> {
    const user =  await this.userService.create(signupInput);
    const token = this.generatedToken(user.id)
    return { token, user }
  }

  async logIn({ email, password }: LoginInput): Promise<AuthResponse> {
    const user =  await this.userService.findOneByEmail(email);
    console.log("🚀 ~ file: auth.service.ts:25 ~ AuthService ~ logIn ~ user", user)
    if(!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(`Email/Password do not match`)
    }
    
    const token = this.generatedToken(user.id)
    return { token, user }
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if(!user.active) throw new UnauthorizedException(`User is inactive, talk with an admin`)
    delete user.password
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.generatedToken(user.id);
    return { token, user };
  }

}
