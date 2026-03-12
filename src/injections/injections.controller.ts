import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { CreateInjectionRequestDto } from './dto/request/create-injection.request.dto';
import { UpdateInjectionRequestDto } from './dto/request/update-injection.request.dto';
import { InjectionResponseDto } from './dto/response/injection.response.dto';
import { UpcomingInjectionResponseDto } from './dto/response/upcoming-injection.response.dto';
import { InjectionsService } from './injections.service';

@ApiTags('Injections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('injections')
export class InjectionsController {
  constructor(private readonly injectionsService: InjectionsService) {}

  @ApiOperation({
    summary: '주사 기록 생성',
  })
  @ApiResponse({
    status: 201,
    type: InjectionResponseDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateInjectionRequestDto,
  ): Promise<InjectionResponseDto> {
    return this.injectionsService.create(user.id, dto);
  }

  @ApiOperation({
    summary: '주사 기록 목록 조회',
  })
  @ApiResponse({
    status: 200,
    type: InjectionResponseDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserData,
  ): Promise<InjectionResponseDto[]> {
    return this.injectionsService.findAll(user.id);
  }

  @ApiOperation({
    summary: '주사 기록 상세 조회',
  })
  @ApiResponse({
    status: 200,
    type: InjectionResponseDto,
  })
  @Get(':id')
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<InjectionResponseDto> {
    return this.injectionsService.findOne(user.id, id);
  }

  @ApiOperation({
    summary: '주사 기록 수정',
  })
  @ApiResponse({
    status: 200,
    type: InjectionResponseDto,
  })
  @Patch(':id')
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateInjectionRequestDto,
  ): Promise<InjectionResponseDto> {
    return this.injectionsService.update(user.id, id, dto);
  }

  @ApiOperation({
    summary: '주사 기록 삭제',
  })
  @ApiResponse({
    status: 200,
    type: InjectionResponseDto,
  })
  @Delete(':id')
  async remove(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<InjectionResponseDto> {
    return this.injectionsService.remove(user.id, id);
  }

  @ApiOperation({
    summary: '가장 최근 주사 기록 조회',
  })
  @ApiResponse({
    status: 200,
    type: InjectionResponseDto,
  })
  @Get('latest/one')
  async findLatest(
    @CurrentUser() user: CurrentUserData,
  ): Promise<InjectionResponseDto | null> {
    return this.injectionsService.findLatest(user.id);
  }

  @ApiOperation({
    summary: '다음 주사 예정 정보 조회',
  })
  @ApiResponse({
    status: 200,
    type: UpcomingInjectionResponseDto,
  })
  @Get('upcoming/one')
  async findUpcoming(
    @CurrentUser() user: CurrentUserData,
  ): Promise<UpcomingInjectionResponseDto> {
    return this.injectionsService.findUpcoming(user.id);
  }
}
