import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/common/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageResizePipe, ImageValidationPipe } from 'src/common/pipe';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put('current')
  updateUser(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadUserAvatar(
    @GetUser('id') userId: string,
    @UploadedFile(ImageValidationPipe, ImageResizePipe)
    pathToFile: string,
  ) {
    return this.usersService.uploadAvatar(userId, pathToFile);
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    await this.usersService.delete(id);
  }
}
