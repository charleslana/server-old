import { CharacterService } from './CharacterService';
import { FastifyReply } from 'fastify';
import { GlobalError } from '../handler/GlobalError';
import { GlobalSuccess } from '../handler/GlobalSuccess';
import { IAttribute } from '../interface/IAttribute';
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

  async updateAttribute(attribute: IAttribute): Promise<void> {
    const find = await this.getByIdAndUserId(attribute.id, attribute.userId);
    if (find.point < attribute.point) {
      throw new GlobalError('Pontos de atributos insuficiente');
    }
    const spentPoint = find.spentPoint ?? 0;
    const attributeToUpdate = attribute.attribute;
    await this.userCharacterRepository.update(attribute.id, {
      point: find.point - attribute.point,
      spentPoint: spentPoint + attribute.point,
      [attributeToUpdate]: find[attributeToUpdate] + attribute.point,
    });
    GlobalSuccess.send(
      attribute.reply,
      'Pontos de atributo adicionado com sucesso'
    );
  }
}
