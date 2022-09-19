import { UserProfile } from '@auth0/nextjs-auth0';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
export type AnyObject = { [key: string]: any };
export type Nullable<T> = T | null | undefined;

export type NumberRecord<T> = {
  length?: undefined;
  [n: number]: T;
}

export type PropsWithUser<T> = T & { user: UserProfile };

export type Severity = 'error' | 'warning' | 'info' | 'success';

export type SuccessResult<T> = {
  success: true;
  data: T;
};
export type ErrorResult = {
  success: false;
  error: ErrorMessage;
};
export type Maybe<T> = SuccessResult<T> | ErrorResult;

export interface StatusMessage {
  severity: Severity;
  message: string;
}

export interface ErrorMessage {
  code: string;
  message: string;
}
