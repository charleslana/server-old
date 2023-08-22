import { User } from '@prisma/client';
import { UserRepository } from '../repository/UserRepository';

export class UserService {
  private userRepository = new UserRepository();

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async updateName(id: number, newName: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    return await this.userRepository.save({
      ...user,
      name: newName,
    });
  }
}
