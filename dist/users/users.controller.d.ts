import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto, UpdatePasswordDto } from './dto';
import { Role } from '../common/constants/roles.constant';
import { PaginationDto } from '../common/dto';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(pagination: PaginationDto, role?: Role): Promise<{
        data: {
            id: string;
            createdAt: Date;
            name: string | null;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            updatedAt: Date;
        }[];
        pagination: {
            page: number | undefined;
            limit: number;
            total: number;
            pages: number;
        };
        stats: {
            byRole: {};
        };
    }>;
    getProfile(user: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    updateProfile(user: AuthenticatedUser, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    updatePassword(user: AuthenticatedUser, dto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    create(createUserDto: CreateUserDto, currentUser: AuthenticatedUser): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, currentUser: AuthenticatedUser): Promise<{
        id: string;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    remove(id: string, currentUser: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
