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
import { EmailMagicLinkStrategy } from './strategy/email-magic-link.strategy';
import { EmailMagicLinkDto } from './dto/email-magic-link.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailMagicLinkAuthGuard } from './guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailMagicLinkStrategy: EmailMagicLinkStrategy,
  ) {}

  @Post('sign-in/by-email')
  login(@Req() req, @Res() res, @Body() body: EmailMagicLinkDto) {
    this.authService.validateUser(body.destination);

    return this.emailMagicLinkStrategy.send(req, res);
  }

  @ApiQuery({ name: 'token' })
  @UseGuards(EmailMagicLinkAuthGuard)
  @Get('sign-in/by-email/callback')
  callback(@Req() req) {
    return this.authService.generateToken(req.user);
  }
}
