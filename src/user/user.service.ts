import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerUser(name: string, kakao: string): Promise<void> {
    const user = this.userRepository.create({
      name,
      kakao,
    });

    await this.userRepository.save(user);
  }
}
