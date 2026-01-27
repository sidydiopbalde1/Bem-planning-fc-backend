import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, AuthResponseDto, UserResponseDto } from './dto';
import type { AuthenticatedUser } from './interfaces/jwt-payload.interface';
interface GoogleAuthRequest extends Request {
    user: UserResponseDto;
}
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    login(loginDto: LoginDto, req: Request): Promise<AuthResponseDto>;
    signup(signupDto: SignupDto, req: Request): Promise<AuthResponseDto>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: GoogleAuthRequest, res: Response): Promise<void>;
    getProfile(user: AuthenticatedUser): Promise<UserResponseDto>;
}
export {};
