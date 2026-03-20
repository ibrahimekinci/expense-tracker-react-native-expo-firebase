import { Alert } from 'react-native';
import { AppError } from './errors/AppError';
import { UI_MESSAGES } from '../constants/uiMessages';

export class ErrorHandler {
  /**
   * Centralized method to safely process errors. Type-checks the incoming unknown 
   * error to display user-friendly Alerts for AppErrors or generic fallback for bugs.
   * 
   * @param error - The raw error caught in a try/catch block
   */
  public static handleError(error: unknown): void {
    if (error instanceof AppError) {
      if (error.isOperational) {
        Alert.alert(UI_MESSAGES.TITLES.ERROR, error.message);
      } else {
        console.error('[CRITICAL APP ERROR]', error);
        Alert.alert(UI_MESSAGES.TITLES.ERROR, UI_MESSAGES.ERRORS.CRITICAL_SYSTEM_ERROR);
      }
    } else {
      console.error('[UNEXPECTED ERROR]', error);
      Alert.alert(UI_MESSAGES.TITLES.ERROR, UI_MESSAGES.ERRORS.UNEXPECTED_ERROR);
    }
  }
}
