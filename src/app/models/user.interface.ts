export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  mobileNumber: string;
  email?: string;
  gender?: string;
  _barangay?: object;
  _role?: string;
  type?: string;
  isMain?: boolean;

  _notaryId?: string;
}
export enum USER_REDUCER_ACTIONS {
  SetUser = 'SET_USER',
  ResetUser = 'RESET_USER',
}
