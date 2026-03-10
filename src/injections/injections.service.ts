import { Injectable } from '@nestjs/common';
import { CreateInjectionDto } from './dto/create-injection.dto';
import { UpdateInjectionDto } from './dto/update-injection.dto';

@Injectable()
export class InjectionsService {
  create(createInjectionDto: CreateInjectionDto) {
    return 'This action adds a new injection';
  }

  findAll() {
    return `This action returns all injections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} injection`;
  }

  update(id: number, updateInjectionDto: UpdateInjectionDto) {
    return `This action updates a #${id} injection`;
  }

  remove(id: number) {
    return `This action removes a #${id} injection`;
  }
}
