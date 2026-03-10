import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InjectionsService } from './injections.service';
import { CreateInjectionDto } from './dto/create-injection.dto';
import { UpdateInjectionDto } from './dto/update-injection.dto';

@Controller('injections')
export class InjectionsController {
  constructor(private readonly injectionsService: InjectionsService) {}

  @Post()
  create(@Body() createInjectionDto: CreateInjectionDto) {
    return this.injectionsService.create(createInjectionDto);
  }

  @Get()
  findAll() {
    return this.injectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.injectionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInjectionDto: UpdateInjectionDto) {
    return this.injectionsService.update(+id, updateInjectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.injectionsService.remove(+id);
  }
}
