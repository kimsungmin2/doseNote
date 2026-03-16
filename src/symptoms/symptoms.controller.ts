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
import { CreateSymptomRequestDto } from './dto/request/create-symptom.request.dto';
import { UpdateSymptomRequestDto } from './dto/request/update-symptom.request.dto';
import { SymptomResponseDto } from './dto/response/symptom.response.dto';
import { SymptomSummaryResponseDto } from './dto/response/symptom-summary.response.dto';
import { SymptomsService } from './symptoms.service';

@ApiTags('Symptoms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @ApiOperation({
    summary: '증상 기록 생성',
  })
  @ApiResponse({
    status: 201,
    type: SymptomResponseDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateSymptomRequestDto,
  ): Promise<SymptomResponseDto> {
    return this.symptomsService.create(user.id, dto);
  }

  @ApiOperation({
    summary: '증상 기록 목록 조회',
  })
  @ApiResponse({
    status: 200,
    type: SymptomResponseDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserData,
  ): Promise<SymptomResponseDto[]> {
    return this.symptomsService.findAll(user.id);
  }

  @ApiOperation({
    summary: '증상 요약 조회',
  })
  @ApiResponse({
    status: 200,
    type: SymptomSummaryResponseDto,
  })
  @Get('summary/one')
  async getSummary(
    @CurrentUser() user: CurrentUserData,
  ): Promise<SymptomSummaryResponseDto> {
    return this.symptomsService.getSummary(user.id);
  }

  @ApiOperation({
    summary: '증상 기록 상세 조회',
  })
  @ApiResponse({
    status: 200,
    type: SymptomResponseDto,
  })
  @Get(':id')
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<SymptomResponseDto> {
    return this.symptomsService.findOne(user.id, id);
  }

  @ApiOperation({
    summary: '증상 기록 수정',
  })
  @ApiResponse({
    status: 200,
    type: SymptomResponseDto,
  })
  @Patch(':id')
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateSymptomRequestDto,
  ): Promise<SymptomResponseDto> {
    return this.symptomsService.update(user.id, id, dto);
  }

  @ApiOperation({
    summary: '증상 기록 삭제',
  })
  @ApiResponse({
    status: 200,
    type: SymptomResponseDto,
  })
  @Delete(':id')
  async remove(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<SymptomResponseDto> {
    return this.symptomsService.remove(user.id, id);
  }
}
