import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/app/models/user.interface';
import { resetUser, setUser } from './user.action';

const userInitialState: User = {
  _id: '',
  firstName: '',
  lastName: '',
  middleName: '',
  mobileNumber: '',
};

const setUserReducer = on(
  setUser,
  (state: User | unknown, props: { user: User }) => {
    return { ...(state as User), ...props.user };
  }
);

const resetUserReducer = on(resetUser, (state: User | unknown) => {
  return { ...userInitialState };
});

const _userReducer = createReducer(
  userInitialState,
  setUserReducer,
  resetUserReducer
);

export const userReducer = (state: User | unknown, action: Action) =>
  _userReducer(state, action);
