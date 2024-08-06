import { EmailMagicLinkDto } from './dto/email-magic-link.dto';
import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailMagicLinkAuthGuard, GoogleOAuthGuard } from './guard';
import { EmailMagicLinkStrategy } from './strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailMagicLinkStrategy: EmailMagicLinkStrategy,
  ) {}

  @Post('email')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signInByEmail(@Req() req, @Res() res, @Body() _body: EmailMagicLinkDto) {
    return this.emailMagicLinkStrategy.send(req, res);
  }

  @ApiQuery({ name: 'token' })
  @UseGuards(EmailMagicLinkAuthGuard)
  @Get('email/callback')
  signInByEmailCallback(@Req() req) {
    return this.authService.signInUser(req.user);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async signInByGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async signInByGoogleCallback(@Req() req) {
    return this.authService.signInUser(req.user);
  }
}
