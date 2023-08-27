import { CharacterService } from './CharacterService';
import { GlobalError } from '../handler/GlobalError';
import { IAttribute } from '../interface/IAttribute';
import { IUserCharacter } from '../interface/IUserCharacter';
import { UserCharacter } from '@prisma/client';
import { UserCharacterRepository } from '../repository/UserCharacterRepository';

export class UserCharacterService {
  private repository = new UserCharacterRepository();
  private characterService = new CharacterService();

  async create(userCharacter: UserCharacter): Promise<UserCharacter> {
    await this.characterService.getById(userCharacter.characterId);
    const exist = await this.repository.existsByName(
      userCharacter.name,
      userCharacter.id
    );
    if (exist) {
      throw new GlobalError('Nome já cadastrado');
    }
    return await this.repository.save(userCharacter);
  }

  async getById(id: number): Promise<UserCharacter> {
    const find = await this.repository.findById(id);
    if (!find) {
      throw new GlobalError('Personagem do usuário não encontrado');
    }
    return find;
  }

  async getByIdAndUserId(id: number, userId: number): Promise<IUserCharacter> {
    const find = await this.repository.findByIdAndUserId(id, userId);
    if (!find) {
      throw new GlobalError('Personagem do usuário não encontrado');
    }
    find.maxExperience = this.calculateMaxExperience(find.level);
    return find;
  }

  async getAllByUserId(userId: number): Promise<UserCharacter[]> {
    const findAll = await this.repository.findAllUserId(userId);
    return findAll;
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.getByIdAndUserId(id, userId);
    await this.repository.delete(id);
  }

  async updateAttribute(attribute: IAttribute): Promise<UserCharacter | null> {
    const find = await this.getByIdAndUserId(attribute.id, attribute.userId);
    if (find.point < attribute.point) {
      throw new GlobalError('Pontos de atributos insuficiente');
    }
    const spentPoint = find.spentPoint ?? 0;
    const attributeToUpdate = attribute.attribute;
    return await this.repository.update(attribute.id, {
      point: find.point - attribute.point,
      spentPoint: spentPoint + attribute.point,
      [attributeToUpdate]: find[attributeToUpdate] + attribute.point,
    });
  }

  async updateGold(
    userCharacter: UserCharacter
  ): Promise<UserCharacter | null> {
    return await this.repository.update(userCharacter.id, {
      gold: userCharacter.gold,
    });
  }

  private calculateMaxExperience(level: number): number {
    return 50 * level;
  }
}
