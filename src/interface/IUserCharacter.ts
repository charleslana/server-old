import {
  Character,
  UserCharacter as PrismaUserCharacter,
} from '@prisma/client';

export interface IUserCharacter extends PrismaUserCharacter {
  character: Character;
  maxExperience: number;
}
