import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type MedicationProfile } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicationRequestDto } from './dto/request/create-medication.request.dto';
import { UpdateMedicationRequestDto } from './dto/request/update-medication.request.dto';
import { MedicationResponseDto } from './dto/response/medication.response.dto';

@Injectable()
export class MedicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateMedicationRequestDto,
  ): Promise<MedicationResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      await tx.medicationProfile.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      const medication = await tx.medicationProfile.create({
        data: {
          userId,
          medicationName: dto.medicationName,
          defaultDosageValue: new Prisma.Decimal(dto.defaultDosageValue),
          defaultDosageUnit: dto.defaultDosageUnit,
          scheduleIntervalDays: dto.scheduleIntervalDays,
          startDate: new Date(dto.startDate),
          notes: dto.notes ?? null,
          isActive: true,
        },
      });

      return this.toResponseDto(medication);
    });
  }
  async findAll(userId: string): Promise<MedicationResponseDto[]> {
    const medications = await this.prisma.medicationProfile.findMany({
      where: {
        userId,
      },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    });

    return medications.map((medication) => this.toResponseDto(medication));
  }

  async findActive(userId: string): Promise<MedicationResponseDto | null> {
    const medication = await this.prisma.medicationProfile.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!medication) {
      return null;
    }

    return this.toResponseDto(medication);
  }

  async findOne(
    userId: string,
    medicationId: string,
  ): Promise<MedicationResponseDto> {
    const medication = await this.findProfileOrThrow(userId, medicationId);
    return this.toResponseDto(medication);
  }

  async update(
    userId: string,
    medicationId: string,
    dto: UpdateMedicationRequestDto,
  ): Promise<MedicationResponseDto> {
    await this.findProfileOrThrow(userId, medicationId);

    return this.prisma.$transaction(async (tx) => {
      if (dto.isActive === true) {
        await tx.medicationProfile.updateMany({
          where: {
            userId,
            isActive: true,
            NOT: {
              id: medicationId,
            },
          },
          data: {
            isActive: false,
          },
        });
      }

      const medication = await tx.medicationProfile.update({
        where: {
          id: medicationId,
        },
        data: {
          medicationName: dto.medicationName,
          defaultDosageValue:
            dto.defaultDosageValue !== undefined
              ? new Prisma.Decimal(dto.defaultDosageValue)
              : undefined,
          defaultDosageUnit: dto.defaultDosageUnit,
          scheduleIntervalDays: dto.scheduleIntervalDays,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          notes: dto.notes,
          isActive: dto.isActive,
        },
      });

      return this.toResponseDto(medication);
    });
  }

  async deactivate(
    userId: string,
    medicationId: string,
  ): Promise<MedicationResponseDto> {
    await this.findProfileOrThrow(userId, medicationId);

    const medication = await this.prisma.medicationProfile.update({
      where: {
        id: medicationId,
      },
      data: {
        isActive: false,
      },
    });

    return this.toResponseDto(medication);
  }

  private async findProfileOrThrow(
    userId: string,
    medicationId: string,
  ): Promise<MedicationProfile> {
    const medication = await this.prisma.medicationProfile.findFirst({
      where: {
        id: medicationId,
        userId,
      },
    });

    if (!medication) {
      throw new NotFoundException('약물 프로필을 찾을 수 없습니다.');
    }

    return medication;
  }

  private toResponseDto(medication: MedicationProfile): MedicationResponseDto {
    return {
      id: medication.id,
      medicationName: medication.medicationName,
      defaultDosageValue: Number(medication.defaultDosageValue),
      defaultDosageUnit: medication.defaultDosageUnit,
      scheduleIntervalDays: medication.scheduleIntervalDays,
      startDate: medication.startDate,
      notes: medication.notes,
      isActive: medication.isActive,
      createdAt: medication.createdAt,
      updatedAt: medication.updatedAt,
    };
  }
}
