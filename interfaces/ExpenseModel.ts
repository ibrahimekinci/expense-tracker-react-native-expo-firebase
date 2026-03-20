import { AuditModel } from './AuditModel';
import { ExpenseCategory } from './ExpenseCategory';

export interface ExpenseModel extends AuditModel {
  userId: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO 8601 String
}
