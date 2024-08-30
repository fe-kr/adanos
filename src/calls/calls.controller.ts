import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser, IPagination, PaginationParams } from 'src/common/decorator';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Calls')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'size', type: Number })
  getCurrentUserCalls(
    @PaginationParams() paginationParams: IPagination,
    @GetUser('id') userId: string,
  ) {
    return this.callsService.findByUserId(userId, paginationParams);
  }
}
