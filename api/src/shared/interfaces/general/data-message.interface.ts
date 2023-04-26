import { IMessage } from './message.interface';

export interface IDataMessage<T> extends IMessage {
  data: T;
}
