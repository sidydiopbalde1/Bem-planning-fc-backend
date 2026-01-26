import { Role } from '../../common/constants/roles.constant';
export declare class CreateUserDto {
    email: string;
    name: string;
    password: string;
    role?: Role;
}
export declare class UpdateUserDto {
    email?: string;
    name?: string;
    role?: Role;
}
export declare class UpdateProfileDto {
    name: string;
}
export declare class UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
