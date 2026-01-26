import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { LoginDto, SignupDto, AuthResponseDto, UserResponseDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private journalService;
    constructor(prisma: PrismaService, jwtService: JwtService, journalService: JournalService);
    validateUser(email: string, password: string): Promise<UserResponseDto | null>;
    login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto>;
    signup(signupDto: SignupDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto>;
    validateGoogleUser(profile: {
        email: string;
        name: string;
    }, ipAddress?: string, userAgent?: string): Promise<UserResponseDto>;
    googleLogin(user: UserResponseDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto>;
    getProfile(userId: string): Promise<UserResponseDto>;
}
