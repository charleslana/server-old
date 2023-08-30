import { GlobalError } from '../handler/GlobalError';
import { Item } from '@prisma/client';
import { ItemRepository } from '../repository/ItemRepository';

export class ItemService {
  private repository = new ItemRepository();

  async getById(id: number): Promise<Item> {
    const find = await this.repository.findById(id);
    if (!find) {
      throw new GlobalError('Item não encontrado');
    }
    return find;
  }
}
