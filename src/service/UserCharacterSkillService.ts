import { GlobalError } from '../handler/GlobalError';
import { SkillService } from './SkillService';
import { UserCharacterSkill } from '@prisma/client';
import { UserCharacterSkillRepository } from '../repository/UserCharacterSkillRepository';

export class UserCharacterSkillService {
  private userCharacterSkillRepository = new UserCharacterSkillRepository();
  private skillService = new SkillService();

  async create(
    userCharacterSkill: UserCharacterSkill
  ): Promise<UserCharacterSkill> {
    await this.skillService.getById(userCharacterSkill.skillId);
    return await this.userCharacterSkillRepository.save(userCharacterSkill);
  }

  async getByIdAndUserCharacterId(
    id: number,
    userCharacterId: number
  ): Promise<UserCharacterSkill> {
    const find =
      await this.userCharacterSkillRepository.findByIdAndUserCharacterId(
        id,
        userCharacterId
      );
    if (!find) {
      throw new GlobalError('Habilidade do personagem não encontrada');
    }
    return find;
  }

  async getAllByUserCharacterId(
    userCharacterId: number
  ): Promise<UserCharacterSkill[]> {
    const findAll =
      await this.userCharacterSkillRepository.findAllUserCharacterId(
        userCharacterId
      );
    return findAll;
  }

  async delete(id: number): Promise<void> {
    await this.userCharacterSkillRepository.delete(id);
  }
}
