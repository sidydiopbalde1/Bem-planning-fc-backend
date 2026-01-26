import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, AuthResponseDto, UserResponseDto } from './dto';
import { Public, CurrentUser } from '../common/decorators';
import type { AuthenticatedUser } from './interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 200, description: 'Connexion réussie', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<AuthResponseDto> {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Inscription utilisateur' })
  @ApiResponse({ status: 201, description: 'Inscription réussie', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async signup(@Body() signupDto: SignupDto, @Req() req: Request): Promise<AuthResponseDto> {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    return this.authService.signup(signupDto, ipAddress, userAgent);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Connexion via Google OAuth' })
  async googleAuth() {
    // Google OAuth redirect
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback Google OAuth' })
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.googleLogin(req.user, ipAddress, userAgent);
    const frontendUrl = this.configService.get('frontend.url');

    // Redirection vers le frontend avec le token
    res.redirect(`${frontendUrl}/auth/callback?token=${result.access_token}`);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtenir le profil de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  async getProfile(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    return this.authService.getProfile(user.id);
  }
}
