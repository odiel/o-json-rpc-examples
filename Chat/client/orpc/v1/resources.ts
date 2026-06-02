
export type Alias = string

export type UsersList = { id: string; alias: string; status: string; }[]

export type Messages = { alias: string; message: string; timestamp: string; }[]

export type InputMessage = { alias: string; message: string; }

export type Message = { alias: string; message: string; timestamp: string; }

export type User = { id: string; alias: string; status: string; }
