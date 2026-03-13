import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, WeightRecord } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWeightRequestDto } from './dto/request/create-weight.request.dto';
import { UpdateWeightRequestDto } from './dto/request/update-weight.request.dto';
import { WeightResponseDto } from './dto/response/weight.response.dto';
import { WeightSummaryResponseDto } from './dto/response/weight-summary.response.dto';

@Injectable()
export class WeightsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateWeightRequestDto,
  ): Promise<WeightResponseDto> {
    const weight = await this.prisma.weightRecord.create({
      data: {
        userId,
        recordedAt: new Date(dto.recordedAt),
        weightKg: new Prisma.Decimal(dto.weightKg),
        memo: dto.memo ?? null,
      },
    });

    return this.toResponseDto(weight);
  }

  async findAll(userId: string): Promise<WeightResponseDto[]> {
    const weights = await this.prisma.weightRecord.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });

    return weights.map((weight) => this.toResponseDto(weight));
  }

  async findOne(userId: string, weightId: string): Promise<WeightResponseDto> {
    const weight = await this.findWeightOrThrow(userId, weightId);
    return this.toResponseDto(weight);
  }

  async update(
    userId: string,
    weightId: string,
    dto: UpdateWeightRequestDto,
  ): Promise<WeightResponseDto> {
    await this.findWeightOrThrow(userId, weightId);

    const weight = await this.prisma.weightRecord.update({
      where: {
        id: weightId,
      },
      data: {
        recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : undefined,
        weightKg:
          dto.weightKg !== undefined
            ? new Prisma.Decimal(dto.weightKg)
            : undefined,
        memo: dto.memo,
      },
    });

    return this.toResponseDto(weight);
  }

  async remove(userId: string, weightId: string): Promise<WeightResponseDto> {
    await this.findWeightOrThrow(userId, weightId);

    const weight = await this.prisma.weightRecord.update({
      where: {
        id: weightId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return this.toResponseDto(weight);
  }

  async findLatest(userId: string): Promise<WeightResponseDto | null> {
    const weight = await this.prisma.weightRecord.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });

    if (!weight) {
      return null;
    }

    return this.toResponseDto(weight);
  }

  async getSummary(userId: string): Promise<WeightSummaryResponseDto> {
    const weights = await this.prisma.weightRecord.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        recordedAt: 'asc',
      },
    });

    if (weights.length === 0) {
      return {
        currentWeight: null,
        startWeight: null,
        diffFromStart: null,
        diff7d: null,
        diff30d: null,
      };
    }

    const startWeight = Number(weights[0].weightKg);
    const currentWeight = Number(weights[weights.length - 1].weightKg);

    const diffFromStart = this.roundToOneDecimal(currentWeight - startWeight);

    const latestRecord = weights[weights.length - 1];
    const latestRecordedAt = latestRecord.recordedAt;

    const weight7d = this.findNearestPastWeight(weights, latestRecordedAt, 7);
    const weight30d = this.findNearestPastWeight(weights, latestRecordedAt, 30);

    const diff7d =
      weight7d !== null
        ? this.roundToOneDecimal(currentWeight - weight7d)
        : null;

    const diff30d =
      weight30d !== null
        ? this.roundToOneDecimal(currentWeight - weight30d)
        : null;

    return {
      currentWeight,
      startWeight,
      diffFromStart,
      diff7d,
      diff30d,
    };
  }

  private async findWeightOrThrow(
    userId: string,
    weightId: string,
  ): Promise<WeightRecord> {
    const weight = await this.prisma.weightRecord.findFirst({
      where: {
        id: weightId,
        userId,
        deletedAt: null,
      },
    });

    if (!weight) {
      throw new NotFoundException('체중 기록을 찾을 수 없습니다.');
    }

    return weight;
  }

  private findNearestPastWeight(
    weights: WeightRecord[],
    latestRecordedAt: Date,
    daysAgo: number,
  ): number | null {
    const targetDate = new Date(latestRecordedAt);
    targetDate.setDate(targetDate.getDate() - daysAgo);

    let candidate: WeightRecord | null = null;

    for (const weight of weights) {
      if (weight.recordedAt <= targetDate) {
        candidate = weight;
      } else {
        break;
      }
    }

    return candidate ? Number(candidate.weightKg) : null;
  }

  private roundToOneDecimal(value: number): number {
    return Math.round(value * 10) / 10;
  }

  private toResponseDto(weight: WeightRecord): WeightResponseDto {
    return {
      id: weight.id,
      recordedAt: weight.recordedAt,
      weightKg: Number(weight.weightKg),
      memo: weight.memo,
      createdAt: weight.createdAt,
      updatedAt: weight.updatedAt,
    };
  }
}
