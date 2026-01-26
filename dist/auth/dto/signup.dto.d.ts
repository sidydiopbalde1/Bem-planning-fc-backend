import { Role } from '../../common/constants/roles.constant';
export declare class SignupDto {
    email: string;
    name: string;
    password: string;
    role?: Role;
}
