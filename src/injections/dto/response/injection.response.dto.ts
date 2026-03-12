import { DoseUnit, InjectionSite } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class InjectionResponseDto {
  @ApiProperty({
    example: 'cm9inj123456',
    description: '주사 기록 ID',
  })
  id: string;

  @ApiProperty({
    example: 'cm9med123456',
    description: '약물 프로필 ID',
  })
  medicationProfileId: string;

  @ApiProperty({
    example: 'Wegovy',
    description: '약물 이름',
  })
  medicationName: string;

  @ApiProperty({
    example: '2026-03-12T09:00:00.000Z',
    description: '주사 투여 일시',
  })
  injectedAt: Date;

  @ApiProperty({
    example: 0.25,
    description: '실제 투여 용량 값',
  })
  dosageValue: number;

  @ApiProperty({
    enum: DoseUnit,
    example: DoseUnit.MG,
    description: '실제 투여 용량 단위',
  })
  dosageUnit: DoseUnit;

  @ApiProperty({
    enum: InjectionSite,
    example: InjectionSite.ABDOMEN,
    description: '주사 부위',
  })
  injectionSite: InjectionSite;

  @ApiProperty({
    example: '복부 우측에 투여',
    description: '메모',
    nullable: true,
  })
  memo: string | null;

  @ApiProperty({
    example: '2026-03-12T09:10:00.000Z',
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-03-12T09:10:00.000Z',
    description: '수정일',
  })
  updatedAt: Date;
}
