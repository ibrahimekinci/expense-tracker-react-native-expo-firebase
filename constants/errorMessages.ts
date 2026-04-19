export const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/wrong-password': 'Invalid email or password. Please try again.',
  'auth/user-not-found': 'Invalid email or password. Please try again.',
  'auth/email-already-in-use': 'This email is already associated with an account.',
  'auth/weak-password': 'The password provided is too weak.',
  'permission-denied': 'You do not have permission to perform this action.',
  'unavailable': 'The service is currently unavailable. Please check your network connection.',
  'default': 'An unexpected service error occurred. Please try again later.',
};

export const VALIDATION_ERRORS = {
  INVALID_EMAIL: "Invalid email format (must contain '@').",
  INVALID_PASSWORD: "Password must be > 8 characters.",
  REQUIRED_FULL_NAME: "Full Name is required.",
  AMOUNT_OUT_OF_BOUNDS: (min: number, max: number) => `Expense amount must be between $${min} and $${max}.`,
};
