import bcrypt from 'bcrypt';
import { AuthService } from './AuthService';
import { FastifyReply } from 'fastify';
import { formatDate, omitField, omitFields } from '../utils/utils';
import { GlobalError } from '../handler/GlobalError';
import { GlobalSuccess } from '../handler/GlobalSuccess';
import { IPassword } from '../interface/IPassword';
import { User } from '@prisma/client';
import { UserRepository } from '../repository/UserRepository';

export class UserService {
  private userRepository = new UserRepository();
  private authService = new AuthService();

  async create(user: User): Promise<Omit<User, 'password'>> {
    const exist = await this.userRepository.findByEmail(user.email);
    if (exist) {
      throw new GlobalError('E-mail já cadastrado');
    }
    const hashedPassword = this.encrypt(user.password);
    const save = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
    return omitField(save, 'password');
  }

  async getById(id: number): Promise<Omit<User, 'password'>> {
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

  async updateName(user: User): Promise<Omit<User, 'password'> | null> {
    await this.getById(user.id);
    const update = await this.userRepository.update(user.id, {
      name: user.name,
    });
    if (update) {
      return omitField(update, 'password');
    }
    return null;
  }

  async delete(id: number, reply: FastifyReply): Promise<void> {
    await this.getById(id);
    await this.userRepository.delete(id);
    GlobalSuccess.send(reply, 'Usuário deletado com sucesso');
  }

  async authenticateAndGenerateToken(
    email: string,
    password: string
  ): Promise<string> {
    const find = await this.userRepository.findByEmail(email);
    if (!find) {
      throw new GlobalError('Credenciais inválidas');
    }
    if (find.bannedTime != null && find.bannedTime > new Date()) {
      throw new GlobalError(
        `Usuário banido até ${formatDate(find.bannedTime)}`
      );
    }
    const passwordMatches = this.decrypt(password, find.password);
    if (!passwordMatches) {
      throw new GlobalError('Credenciais inválidas');
    }
    const token = this.authService.generateToken(find);
    return token;
  }

  async updatePassword(password: IPassword): Promise<void> {
    const find = await this.userRepository.findById(password.userId);
    if (!find) {
      throw new GlobalError('Usuário não encontrado');
    }
    if (!this.decrypt(password.currentPassword, find.password)) {
      throw new GlobalError('Senha atual inválida');
    }
    await this.userRepository.update(password.userId, {
      password: this.encrypt(password.newPassword),
    });
    GlobalSuccess.send(password.reply, 'Senha alterada com sucesso');
  }

  encrypt(password: string): string {
    const salt = +process.env.BCRYPT_SALT!;
    return bcrypt.hashSync(`${password}${process.env.BCRYPT_PASSWORD}`, salt);
  }

  private decrypt(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(
      `${password}${process.env.BCRYPT_PASSWORD}`,
      hashPassword
    );
  }
}
