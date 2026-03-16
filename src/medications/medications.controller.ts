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
import { CreateMedicationRequestDto } from './dto/request/create-medication.request.dto';
import { UpdateMedicationRequestDto } from './dto/request/update-medication.request.dto';
import { MedicationResponseDto } from './dto/response/medication.response.dto';
import { MedicationsService } from './medications.service';

@ApiTags('Medications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @ApiOperation({
    summary: '약물 프로필 생성',
  })
  @ApiResponse({
    status: 201,
    type: MedicationResponseDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateMedicationRequestDto,
  ): Promise<MedicationResponseDto> {
    return this.medicationsService.create(user.id, dto);
  }

  @ApiOperation({
    summary: '약물 프로필 목록 조회',
  })
  @ApiResponse({
    status: 200,
    type: MedicationResponseDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserData,
  ): Promise<MedicationResponseDto[]> {
    return this.medicationsService.findAll(user.id);
  }

  @ApiOperation({
    summary: '현재 활성 약물 프로필 조회',
  })
  @ApiResponse({
    status: 200,
    type: MedicationResponseDto,
  })
  @Get('active')
  async findActive(
    @CurrentUser() user: CurrentUserData,
  ): Promise<MedicationResponseDto | null> {
    return this.medicationsService.findActive(user.id);
  }

  @ApiOperation({
    summary: '약물 프로필 상세 조회',
  })
  @ApiResponse({
    status: 200,
    type: MedicationResponseDto,
  })
  @Get(':id')
  async findOne(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<MedicationResponseDto> {
    return this.medicationsService.findOne(user.id, id);
  }

  @ApiOperation({
    summary: '약물 프로필 수정',
  })
  @ApiResponse({
    status: 200,
    type: MedicationResponseDto,
  })
  @Patch(':id')
  async update(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateMedicationRequestDto,
  ): Promise<MedicationResponseDto> {
    return this.medicationsService.update(user.id, id, dto);
  }

  @ApiOperation({
    summary: '약물 프로필 비활성화',
  })
  @ApiResponse({
    status: 200,
    type: MedicationResponseDto,
  })
  @Delete(':id')
  async deactivate(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<MedicationResponseDto> {
    return this.medicationsService.deactivate(user.id, id);
  }
}
