import { AppError } from './AppError';
import { FIREBASE_ERRORS } from '../../constants/errorMessages';

export class FirebaseAppError extends AppError {
  constructor(firebaseErrorCode: string) {
    const message = FIREBASE_ERRORS[firebaseErrorCode] || FIREBASE_ERRORS['default'];

    super(message, 500, firebaseErrorCode, true);
  }
}
