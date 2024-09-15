export type UserRole = 'admin' | 'sales_agent' | 'sales_coach';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    role: UserRole;
    is_active: boolean;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}


export interface INewUser extends Omit<User, 'id' | 'role' | 'is_deleted' | 'created_at' | 'updated_at'> {
    password?: string | null;
}