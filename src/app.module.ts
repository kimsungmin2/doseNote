import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MedicationsModule } from './medications/medications.module';
import { InjectionsModule } from './injections/injections.module';
import { WeightsModule } from './weights/weights.module';
import { SymptomsModule } from './symptoms/symptoms.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    MedicationsModule,
    InjectionsModule,
    WeightsModule,
    SymptomsModule,
    DashboardModule,
    PrismaModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
