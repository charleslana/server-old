import bcrypt from 'bcrypt';
import { FastifyReply } from 'fastify';
import { GlobalError } from '../handler/GlobalError';
import { GlobalSuccess } from '../handler/GlobalSuccess';
import { omitField, omitFields } from '../utils/utils';
import { User } from '@prisma/client';
import { UserRepository } from '../repository/UserRepository';

export class UserService {
  private userRepository = new UserRepository();

  async create(user: User): Promise<User> {
    const exist = await this.userRepository.findByEmail(user.email);
    if (exist) {
      throw new GlobalError('E-mail já cadastrado');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
  }

  async getById(id: number): Promise<Omit<User, 'password'> | null> {
    const find = await this.userRepository.findById(id);
    if (!find) {
      throw new GlobalError('Usuário não encontrado');
    }
    return omitField(find, 'password');
  }

  async getAll(): Promise<Omit<User, 'password' | 'email'>[]> {
    const findAll = await this.userRepository.findAll();
    return findAll.map(user => omitFields(user, ['email', 'password']));
  }

  async updateName(user: User): Promise<User | null> {
    await this.getById(user.id);
    const exist = await this.userRepository.existsByName(user.name, user.id);
    if (exist) {
      throw new GlobalError('Nome já cadastrado');
    }
    return await this.userRepository.update(user.id, {
      name: user.name,
    });
  }

  async delete(id: number, reply: FastifyReply): Promise<void> {
    await this.getById(id);
    await this.userRepository.delete(id);
    GlobalSuccess.send(reply, 'Data deleted successfully');
  }
}
