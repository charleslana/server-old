import { CharacterService } from './CharacterService';
import { FastifyReply } from 'fastify';
import { GlobalError } from '../handler/GlobalError';
import { GlobalSuccess } from '../handler/GlobalSuccess';
import { UserCharacter } from '@prisma/client';
import { UserCharacterRepository } from '../repository/UserCharacterRepository';

export class UserCharacterService {
  private userCharacterRepository = new UserCharacterRepository();
  private characterService = new CharacterService();

  async create(userCharacter: UserCharacter): Promise<UserCharacter> {
    await this.characterService.getById(userCharacter.characterId);
    const exist = await this.userCharacterRepository.existsByName(
      userCharacter.name,
      userCharacter.id
    );
    if (exist) {
      throw new GlobalError('Nome já cadastrado');
    }
    return await this.userCharacterRepository.save(userCharacter);
  }

  async getById(id: number): Promise<UserCharacter> {
    const find = await this.userCharacterRepository.findById(id);
    if (!find) {
      throw new GlobalError('Personagem do usuário não encontrado');
    }
    return find;
  }

  async getByIdAndUserId(id: number, userId: number): Promise<UserCharacter> {
    const find = await this.userCharacterRepository.findByIdAndUserId(
      id,
      userId
    );
    if (!find) {
      throw new GlobalError('Personagem do usuário não encontrado');
    }
    return find;
  }

  async getAllByUserId(userId: number): Promise<UserCharacter[]> {
    const findAll = await this.userCharacterRepository.findAllUserId(userId);
    return findAll;
  }

  async delete(id: number, userId: number, reply: FastifyReply): Promise<void> {
    await this.getByIdAndUserId(id, userId);
    await this.userCharacterRepository.delete(id);
    GlobalSuccess.send(reply, 'Personagem do usuário excluído com sucesso');
  }
}
