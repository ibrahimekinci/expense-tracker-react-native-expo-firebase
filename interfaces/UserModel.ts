import { AuditModel } from './AuditModel';

export interface UserModel extends AuditModel {
  fullName: string;
  email: string;
}
