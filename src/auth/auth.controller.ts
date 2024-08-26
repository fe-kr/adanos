import { EmailMagicLinkDto } from './dto/email-magic-link.dto';
import { EmailMagicLinkVerifyDto } from './dto/email-magic-link-verify.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  UseGuards,
  Body,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import {
  EmailMagicLinkAuthGuard,
  GoogleOAuthGuard,
  JwtAuthGuard,
} from './guard';
import { EmailMagicLinkStrategy } from './strategy';
import { GetUser } from 'src/common/decorator';

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

  @Put('session')
  @UseGuards(JwtAuthGuard)
  updateSession(@GetUser('id') userId: string, @Body() body: UpdateSessionDto) {
    return this.authService.updateUserSession(userId, body);
  }
}
