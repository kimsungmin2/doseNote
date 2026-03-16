import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type InjectionRecord } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInjectionRequestDto } from './dto/request/create-injection.request.dto';
import { UpdateInjectionRequestDto } from './dto/request/update-injection.request.dto';
import { InjectionResponseDto } from './dto/response/injection.response.dto';
import { UpcomingInjectionResponseDto } from './dto/response/upcoming-injection.response.dto';

@Injectable()
export class InjectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateInjectionRequestDto,
  ): Promise<InjectionResponseDto> {
    const medicationProfile = await this.prisma.medicationProfile.findFirst({
      where: {
        id: dto.medicationProfileId,
        userId,
      },
    });

    if (!medicationProfile) {
      throw new NotFoundException('약물 프로필을 찾을 수 없습니다.');
    }

    const injection = await this.prisma.injectionRecord.create({
      data: {
        userId,
        medicationProfileId: medicationProfile.id,
        injectedAt: new Date(dto.injectedAt),
        dosageValue: new Prisma.Decimal(
          dto.dosageValue ?? Number(medicationProfile.defaultDosageValue),
        ),
        dosageUnit: dto.dosageUnit ?? medicationProfile.defaultDosageUnit,
        injectionSite: dto.injectionSite,
        memo: dto.memo ?? null,
      },
      include: {
        medicationProfile: true,
      },
    });

    return this.toResponseDto(injection);
  }

  async findAll(userId: string): Promise<InjectionResponseDto[]> {
    const injections = await this.prisma.injectionRecord.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        medicationProfile: true,
      },
      orderBy: {
        injectedAt: 'desc',
      },
    });

    return injections.map((injection) => this.toResponseDto(injection));
  }

  async findOne(
    userId: string,
    injectionId: string,
  ): Promise<InjectionResponseDto> {
    const injection = await this.findInjectionOrThrow(userId, injectionId);

    return this.toResponseDto(injection);
  }

  async update(
    userId: string,
    injectionId: string,
    dto: UpdateInjectionRequestDto,
  ): Promise<InjectionResponseDto> {
    await this.findInjectionOrThrow(userId, injectionId);

    const injection = await this.prisma.injectionRecord.update({
      where: {
        id: injectionId,
      },
      data: {
        injectedAt: dto.injectedAt ? new Date(dto.injectedAt) : undefined,
        dosageValue:
          dto.dosageValue !== undefined
            ? new Prisma.Decimal(dto.dosageValue)
            : undefined,
        dosageUnit: dto.dosageUnit,
        injectionSite: dto.injectionSite,
        memo: dto.memo,
      },
      include: {
        medicationProfile: true,
      },
    });

    return this.toResponseDto(injection);
  }

  async remove(
    userId: string,
    injectionId: string,
  ): Promise<InjectionResponseDto> {
    await this.findInjectionOrThrow(userId, injectionId);

    const injection = await this.prisma.injectionRecord.update({
      where: {
        id: injectionId,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        medicationProfile: true,
      },
    });

    return this.toResponseDto(injection);
  }

  async findLatest(userId: string): Promise<InjectionResponseDto | null> {
    const injection = await this.prisma.injectionRecord.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        medicationProfile: true,
      },
      orderBy: {
        injectedAt: 'desc',
      },
    });

    if (!injection) {
      return null;
    }

    return this.toResponseDto(injection);
  }

  async findUpcoming(userId: string): Promise<UpcomingInjectionResponseDto> {
    const activeMedication = await this.prisma.medicationProfile.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!activeMedication) {
      throw new NotFoundException('활성 약물 프로필을 찾을 수 없습니다.');
    }

    const latestInjection = await this.prisma.injectionRecord.findFirst({
      where: {
        userId,
        medicationProfileId: activeMedication.id,
        deletedAt: null,
      },
      orderBy: {
        injectedAt: 'desc',
      },
    });

    const baseDate = latestInjection
      ? latestInjection.injectedAt
      : activeMedication.startDate;

    const nextPlannedAt = new Date(baseDate);
    nextPlannedAt.setDate(
      nextPlannedAt.getDate() + activeMedication.scheduleIntervalDays,
    );

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const isDueToday =
      nextPlannedAt >= startOfToday && nextPlannedAt <= endOfToday;

    let overdueDays = 0;

    if (nextPlannedAt < startOfToday) {
      const diffMs = startOfToday.getTime() - nextPlannedAt.getTime();
      overdueDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    return {
      lastInjectedAt: latestInjection ? latestInjection.injectedAt : null,
      scheduleIntervalDays: activeMedication.scheduleIntervalDays,
      nextPlannedAt,
      isDueToday,
      overdueDays,
    };
  }

  private async findInjectionOrThrow(userId: string, injectionId: string) {
    const injection = await this.prisma.injectionRecord.findFirst({
      where: {
        id: injectionId,
        userId,
        deletedAt: null,
      },
      include: {
        medicationProfile: true,
      },
    });

    if (!injection) {
      throw new NotFoundException('주사 기록을 찾을 수 없습니다.');
    }

    return injection;
  }

  private toResponseDto(
    injection: InjectionRecord & {
      medicationProfile: {
        id: string;
        medicationName: string;
      };
    },
  ): InjectionResponseDto {
    return {
      id: injection.id,
      medicationProfileId: injection.medicationProfileId,
      medicationName: injection.medicationProfile.medicationName,
      injectedAt: injection.injectedAt,
      dosageValue: Number(injection.dosageValue),
      dosageUnit: injection.dosageUnit,
      injectionSite: injection.injectionSite,
      memo: injection.memo,
      createdAt: injection.createdAt,
      updatedAt: injection.updatedAt,
    };
  }
}
