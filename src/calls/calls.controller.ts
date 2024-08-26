import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser, IPagination, PaginationParams } from 'src/common/decorator';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCallDto } from './dto/create-call.dto';

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

  @Post()
  createUser(@Body() createCallDto: CreateCallDto) {
    return this.callsService.create(createCallDto);
  }
}
