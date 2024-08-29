import { EmailMagicLinkDto } from './dto/email-magic-link.dto';
import { EmailMagicLinkVerifyDto } from './dto/email-magic-link-verify.dto';
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
import { ApiTags } from '@nestjs/swagger';
import { EmailMagicLinkAuthGuard, GoogleOAuthGuard } from './guard';
import { EmailMagicLinkStrategy } from './strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailMagicLinkStrategy: EmailMagicLinkStrategy,
  ) {}

  @Post('email/register')
  signUpByEmail(@Req() req, @Res() res, @Body() body: EmailMagicLinkDto) {
    req.body.destination = body.email;
    this.emailMagicLinkStrategy.send(req, res);
  }

  @Post('email/login')
  signInByEmail(@Req() req, @Res() res, @Body() body: EmailMagicLinkVerifyDto) {
    req.body.destination = body.email;
    this.emailMagicLinkStrategy.send(req, res);
  }

  @Get('email/callback')
  @UseGuards(EmailMagicLinkAuthGuard)
  signInByEmailCallback(@Req() req) {
    return this.authService.signInUser(req.user);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  signInByGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  signInByGoogleCallback(@Req() req) {
    return this.authService.signInUser(req.user);
  }
}
