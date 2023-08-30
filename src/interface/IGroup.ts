import { Group as PrismaGroup, UserCharacterGroup } from '@prisma/client';

export interface IGroup extends PrismaGroup {
  UserCharacterGroup: UserCharacterGroup;
}
