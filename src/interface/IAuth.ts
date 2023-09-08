import { IUserRole } from './IUserRole';

export interface IAuth {
  user: {
    id: number;
    authToken?: string;
    roles: IUserRole[];
  };
}
