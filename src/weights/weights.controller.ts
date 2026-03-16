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
import { CurrentUser } from '../utils/decorators/current-user.decorator';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { CurrentUserData } from '../utils/interfaces/current-user.interface';
import { CreateWeightRequestDto } from './dto/request/create-weight.request.dto';
import { UpdateWeightRequestDto } from './dto/request/update-weight.request.dto';
import { WeightResponseDto } from './dto/response/weight.response.dto';
import { WeightSummaryResponseDto } from './dto/response/weight-summary.response.dto';
import { WeightsService } from './weights.service';

@ApiTags('Weights')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weights')
export class WeightsController {
  constructor(private readonly weightsService: WeightsService) {}

  @ApiOperation({
    summary: '체중 기록 생성',
  })
  @ApiResponse({
    status: 201,
    type: WeightResponseDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateWeightRequestDto,
  ): Promise<WeightResponseDto> {
    return this.weightsService.create(user.id, dto);
  }

  @ApiOperation({
    summary: '체중 기록 목록 조회',
  })
  @ApiResponse({
    status: 200,
    type: WeightResponseDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserData,
  ): Promise<WeightResponseDto[]> {
    return this.weightsService.findAll(user.id);
  }

  @ApiOperation({
    summary: '가장 최근 체중 조회',
  })
  @ApiResponse({
    status: 200,
    type: WeightResponseDto,
  })
  @Get('latest/one')
  async findLatest(
    @CurrentUser() user: CurrentUserData,
  ): Promise<WeightResponseDto | null> {
    return this.weightsService.findLatest(user.id);
  }

  @ApiOperation({
    summary: '체중 요약 조회',
  })
  @ApiResponse({
    status: 200,
    type: WeightSummaryResponseDto,
  })
  @Get('summary/one')
  async getSummary(
    @CurrentUser() user: CurrentUserData,
  ): Promise<WeightSummaryResponseDto> {
    return this.weightsService.getSummary(user.id);
  }

  @ApiOperation({
    summary: '체중 기록 상세 조회',
  })
  @ApiResponse({
    status: 200,
    type: WeightResponseDto,
  })
  @Get(':id')
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<WeightResponseDto> {
    return this.weightsService.findOne(user.id, id);
  }

  @ApiOperation({
    summary: '체중 기록 수정',
  })
  @ApiResponse({
    status: 200,
    type: WeightResponseDto,
  })
  @Patch(':id')
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateWeightRequestDto,
  ): Promise<WeightResponseDto> {
    return this.weightsService.update(user.id, id, dto);
  }

  @ApiOperation({
    summary: '체중 기록 삭제',
  })
  @ApiResponse({
    status: 200,
    type: WeightResponseDto,
  })
  @Delete(':id')
  async remove(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<WeightResponseDto> {
    return this.weightsService.remove(user.id, id);
  }
}
