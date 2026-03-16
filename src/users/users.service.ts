import { Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface CreateUserParams {
  email: string;
  passwordHash: string;
  nickname: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(params: CreateUserParams): Promise<User> {
    const { email, passwordHash, nickname } = params;

    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async getByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
