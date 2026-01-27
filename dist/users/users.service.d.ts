import { PrismaService } from '../prisma/prisma.service';
import { JournalService } from '../journal/journal.service';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto, UpdatePasswordDto } from './dto';
import { PaginationDto } from '../common/dto';
import { Role } from '../common/constants/roles.constant';
export declare class UsersService {
    private prisma;
    private journalService;
    constructor(prisma: PrismaService, journalService: JournalService);
    create(createUserDto: CreateUserDto, currentUserId?: string, currentUserName?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
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
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
        password: string;
    } | null>;
    update(id: string, updateUserDto: UpdateUserDto, currentUserId?: string, currentUserName?: string): Promise<{
        id: string;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    updatePassword(userId: string, dto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    remove(id: string, currentUserId?: string, currentUserName?: string): Promise<{
        message: string;
    }>;
}
