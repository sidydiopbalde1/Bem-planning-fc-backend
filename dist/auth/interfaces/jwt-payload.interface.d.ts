import { Role } from '../../common/constants/roles.constant';
export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    role: Role;
}
