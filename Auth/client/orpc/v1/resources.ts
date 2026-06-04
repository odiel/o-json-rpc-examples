export type SignedUser = { userId: string; auth: { apiKey: string; sessionId: string; tokens: { access: string; refresh: string } } };

export type UserCredentials = { username: string; password: string };

export type UserAccount = { id: string; username: string; signedInDate: string };
