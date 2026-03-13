import { Injectable, NotFoundException } from '@nestjs/common';
import { SymptomRecord, SymptomType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSymptomRequestDto } from './dto/request/create-symptom.request.dto';
import { UpdateSymptomRequestDto } from './dto/request/update-symptom.request.dto';
import { SymptomResponseDto } from './dto/response/symptom.response.dto';
import { SymptomSummaryResponseDto } from './dto/response/symptom-summary.response.dto';

@Injectable()
export class SymptomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateSymptomRequestDto,
  ): Promise<SymptomResponseDto> {
    if (dto.injectionRecordId) {
      await this.validateInjectionOwnership(userId, dto.injectionRecordId);
    }

    const symptom = await this.prisma.symptomRecord.create({
      data: {
        userId,
        injectionRecordId: dto.injectionRecordId ?? null,
        symptomType: dto.symptomType,
        severity: dto.severity,
        recordedAt: new Date(dto.recordedAt),
        memo: dto.memo ?? null,
      },
    });

    return this.toResponseDto(symptom);
  }

  async findAll(userId: string): Promise<SymptomResponseDto[]> {
    const symptoms = await this.prisma.symptomRecord.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });

    return symptoms.map((symptom) => this.toResponseDto(symptom));
  }

  async findOne(
    userId: string,
    symptomId: string,
  ): Promise<SymptomResponseDto> {
    const symptom = await this.findSymptomOrThrow(userId, symptomId);
    return this.toResponseDto(symptom);
  }

  async update(
    userId: string,
    symptomId: string,
    dto: UpdateSymptomRequestDto,
  ): Promise<SymptomResponseDto> {
    await this.findSymptomOrThrow(userId, symptomId);

    if (dto.injectionRecordId) {
      await this.validateInjectionOwnership(userId, dto.injectionRecordId);
    }

    const symptom = await this.prisma.symptomRecord.update({
      where: {
        id: symptomId,
      },
      data: {
        injectionRecordId: dto.injectionRecordId,
        symptomType: dto.symptomType,
        severity: dto.severity,
        recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : undefined,
        memo: dto.memo,
      },
    });

    return this.toResponseDto(symptom);
  }

  async remove(userId: string, symptomId: string): Promise<SymptomResponseDto> {
    await this.findSymptomOrThrow(userId, symptomId);

    const symptom = await this.prisma.symptomRecord.update({
      where: {
        id: symptomId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return this.toResponseDto(symptom);
  }

  async getSummary(userId: string): Promise<SymptomSummaryResponseDto> {
    const symptoms = await this.prisma.symptomRecord.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });

    if (symptoms.length === 0) {
      return {
        topSymptoms: [],
        averageSeverity: null,
        recentSymptoms: [],
      };
    }

    const frequencyMap = new Map<SymptomType, number>();

    let severitySum = 0;

    for (const symptom of symptoms) {
      severitySum += symptom.severity;
      frequencyMap.set(
        symptom.symptomType,
        (frequencyMap.get(symptom.symptomType) ?? 0) + 1,
      );
    }

    const topSymptoms = Array.from(frequencyMap.entries())
      .map(([symptomType, count]) => ({
        symptomType,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const averageSeverity =
      Math.round((severitySum / symptoms.length) * 10) / 10;

    const recentSymptoms = symptoms
      .slice(0, 5)
      .map((symptom) => this.toResponseDto(symptom));

    return {
      topSymptoms,
      averageSeverity,
      recentSymptoms,
    };
  }

  private async findSymptomOrThrow(
    userId: string,
    symptomId: string,
  ): Promise<SymptomRecord> {
    const symptom = await this.prisma.symptomRecord.findFirst({
      where: {
        id: symptomId,
        userId,
        deletedAt: null,
      },
    });

    if (!symptom) {
      throw new NotFoundException('증상 기록을 찾을 수 없습니다.');
    }

    return symptom;
  }

  private async validateInjectionOwnership(
    userId: string,
    injectionRecordId: string,
  ): Promise<void> {
    const injection = await this.prisma.injectionRecord.findFirst({
      where: {
        id: injectionRecordId,
        userId,
        deletedAt: null,
      },
    });

    if (!injection) {
      throw new NotFoundException('연결할 주사 기록을 찾을 수 없습니다.');
    }
  }

  private toResponseDto(symptom: SymptomRecord): SymptomResponseDto {
    return {
      id: symptom.id,
      injectionRecordId: symptom.injectionRecordId,
      symptomType: symptom.symptomType,
      severity: symptom.severity,
      recordedAt: symptom.recordedAt,
      memo: symptom.memo,
      createdAt: symptom.createdAt,
      updatedAt: symptom.updatedAt,
    };
  }
}
