import { Role } from '../../common/constants/roles.constant';
export declare class UserResponseDto {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
}
export declare class AuthResponseDto {
    access_token: string;
    user: UserResponseDto;
}
