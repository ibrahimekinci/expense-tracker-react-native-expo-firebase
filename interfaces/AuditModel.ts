export interface AuditModel {
  id?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
  deletedAt?: number | null;
}
