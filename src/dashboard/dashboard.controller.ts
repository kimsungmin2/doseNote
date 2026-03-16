import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../utils/decorators/current-user.decorator';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { CurrentUserData } from '../utils/interfaces/current-user.interface';
import { HomeDashboardResponseDto } from './dto/response/home-dashboard.response.dto';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: '홈 대시보드 조회',
  })
  @ApiResponse({
    status: 200,
    type: HomeDashboardResponseDto,
  })
  @Get('home')
  async getHome(
    @CurrentUser() user: CurrentUserData,
  ): Promise<HomeDashboardResponseDto> {
    return this.dashboardService.getHome(user.id);
  }
}
