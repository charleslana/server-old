import jwt from 'jsonwebtoken';
import { GlobalError } from '../handler/GlobalError';
import { IAuth } from '../interface/IAuth';
import { IUser } from '../interface/IUser';

export class AuthService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET as string;
  }

  generateToken(user: IUser): string {
    const payload: IAuth = {
      user: {
        id: user.id,
        roles: user.roles,
      },
    };
    const options = {
      expiresIn: '1h',
    };
    return jwt.sign(payload, this.secretKey, options);
  }

  verifyJwtToken(token: string): IAuth {
    try {
      const cleanToken = token.replace('Bearer ', '');
      const decodedToken = jwt.verify(cleanToken, this.secretKey) as IAuth;
      if (!('user' in decodedToken) || !('id' in decodedToken.user)) {
        throw new GlobalError('Token inválido ou expirado', 401);
      }
      return decodedToken;
    } catch (error) {
      throw new GlobalError('Token inválido', 401);
    }
  }
}
