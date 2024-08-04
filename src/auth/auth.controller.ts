import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailMagicLinkStrategy } from './strategies/email-magic-link.strategy';
import { EmailMagicLinkDto } from './dto/email-magic-link.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailMagicLinkStrategy: EmailMagicLinkStrategy,
  ) {}

  @Post('login/by-email')
  login(@Req() req, @Res() res, @Body() body: EmailMagicLinkDto) {
    this.authService.validateUser(body.destination);

    return this.emailMagicLinkStrategy.send(req, res);
  }

  // @ApiQuery({ name: 'token' }) uncomment for test purpose
  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/by-email/callback')
  callback(@Req() req) {
    return this.authService.generateToken(req.user);
  }
}
