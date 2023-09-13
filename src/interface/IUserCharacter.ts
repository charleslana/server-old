import {
  Character,
  UserCharacter as PrismaUserCharacter,
  UserCharacterGroup,
} from '@prisma/client';

export interface IUserCharacter extends PrismaUserCharacter {
  character: Character;
  maxExperience: number;
  groupMember?: UserCharacterGroup;
}
