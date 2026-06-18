import { signal } from '@preact/signals';
import { SignedUser, UserAccount, UserCredentials } from '../../orpc/index.ts';

export const credentials = signal<UserCredentials | undefined>(undefined);
export const signedUser = signal<SignedUser | undefined>(undefined);
export const userAccount = signal<UserAccount & { scheme: string } | undefined>(undefined);
