import bcrypt from 'bcrypt';
import { AuthService } from './AuthService';
import { GlobalError } from '../handler/GlobalError';
import { IPassword } from '../interface/IPassword';
import { User } from '@prisma/client';
import { UserRepository } from '../repository/UserRepository';
import {
  formatDate,
  omitField,
  omitFields,
  randomString,
} from '../utils/utils';

export class UserService {
  private repository = new UserRepository();
  private authService = new AuthService();

  async create(user: User): Promise<Omit<User, 'password'>> {
    const exist = await this.repository.findByEmail(user.email);
    if (exist) {
      throw new GlobalError('E-mail já cadastrado');
    }
    const hashedPassword = this.encrypt(user.password);
    user.email = user.email.toLowerCase();
    const save = await this.repository.save({
      ...user,
      password: hashedPassword,
    });
    return omitField(save, 'password');
  }

  async getById(id: number): Promise<Omit<User, 'password'>> {
    const find = await this.repository.findById(id);
    if (!find) {
      throw new GlobalError('Usuário não encontrado');
    }
    return omitField(find, 'password');
  }

  async getAll(): Promise<Omit<User, 'password' | 'email'>[]> {
    const findAll = await this.repository.findAll();
    return findAll.map(user => omitFields(user, ['email', 'password']));
  }

  async updateName(user: User): Promise<Omit<User, 'password'> | null> {
    await this.getById(user.id);
    const update = await this.repository.update(user.id, {
      name: user.name,
    });
    if (update) {
      return omitField(update, 'password');
    }
    return null;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }

  async authenticateAndGenerateToken(
    email: string,
    password: string
  ): Promise<string> {
    const find = await this.repository.findByEmail(email);
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
    const authToken = await this.updateToken(find.id);
    find.authToken = authToken;
    const token = this.authService.generateToken(find);
    return token;
  }

  async updatePassword(password: IPassword): Promise<void> {
    const find = await this.repository.findById(password.userId);
    if (!find) {
      throw new GlobalError('Usuário não encontrado');
    }
    if (!this.decrypt(password.currentPassword, find.password)) {
      throw new GlobalError('Senha atual inválida');
    }
    await this.repository.update(password.userId, {
      password: this.encrypt(password.newPassword),
    });
  }

  encrypt(password: string): string {
    const salt = +process.env.BCRYPT_SALT!;
    return bcrypt.hashSync(`${password}${process.env.BCRYPT_PASSWORD}`, salt);
  }

  async getAuth(id: number, authToken: string | null): Promise<boolean> {
    const find = await this.getById(id);
    return find.authToken === authToken;
  }

  private decrypt(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(
      `${password}${process.env.BCRYPT_PASSWORD}`,
      hashPassword
    );
  }

  private async updateToken(id: number): Promise<string> {
    const authToken = randomString(100);
    await this.repository.update(id, {
      authToken,
    });
    return authToken;
  }
}
