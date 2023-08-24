import { IUserRole } from './IUserRole';

export interface IAuth {
  user: {
    id: number;
    roles: IUserRole[];
  };
}
