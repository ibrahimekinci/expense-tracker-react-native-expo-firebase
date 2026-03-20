import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message: string, errorCode: string = 'VALIDATION_ERROR') {
    super(message, 400, errorCode, true);
  }
}
