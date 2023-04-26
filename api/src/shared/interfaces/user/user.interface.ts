/* eslint-disable @typescript-eslint/ban-types */
import { ITimestamps } from '../general';

export interface IUser extends ITimestamps {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  password?: string;
  comparePassword?: Function;
  updatePassword?: Function;
}
