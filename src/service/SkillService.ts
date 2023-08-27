import { GlobalError } from '../handler/GlobalError';
import { Skill } from '@prisma/client';
import { SkillRepository } from '../repository/SkillRepository';

export class SkillService {
  private repository = new SkillRepository();

  async getById(id: number): Promise<Skill> {
    const find = await this.repository.findById(id);
    if (!find) {
      throw new GlobalError('Habilidade não encontrada');
    }
    return find;
  }
}
