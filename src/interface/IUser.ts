import { Role, User as PrismaUser } from '@prisma/client';

export interface IUser extends PrismaUser {
  roles: Role[];
}
