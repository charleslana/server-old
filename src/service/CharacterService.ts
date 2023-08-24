import { Character } from '@prisma/client';
import { CharacterRepository } from '../repository/CharacterRepository';
import { GlobalError } from '../handler/GlobalError';

export class CharacterService {
  private characterRepository = new CharacterRepository();

  async getById(id: number): Promise<Character> {
    const find = await this.characterRepository.findById(id);
    if (!find) {
      throw new GlobalError('Personagem não encontrado');
    }
    return find;
  }

  async getAll(): Promise<Character[]> {
    const findAll = await this.characterRepository.findAll();
    return findAll;
  }
}
