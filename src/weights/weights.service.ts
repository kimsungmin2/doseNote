import { Injectable } from '@nestjs/common';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';

@Injectable()
export class WeightsService {
  create(createWeightDto: CreateWeightDto) {
    return 'This action adds a new weight';
  }

  findAll() {
    return `This action returns all weights`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weight`;
  }

  update(id: number, updateWeightDto: UpdateWeightDto) {
    return `This action updates a #${id} weight`;
  }

  remove(id: number) {
    return `This action removes a #${id} weight`;
  }
}
