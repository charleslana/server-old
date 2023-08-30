import { AttributeEnum } from '../enum/AttributeEnum';

export interface IAttribute {
  attribute: AttributeEnum;
  point: number;
  id: number;
  userId: number;
}
