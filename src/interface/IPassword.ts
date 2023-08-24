import { IReply } from './IReply';

export interface IPassword extends IReply {
  userId: number;
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}
