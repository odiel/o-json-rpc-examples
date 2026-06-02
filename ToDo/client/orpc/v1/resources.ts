
export type Task = { id: string; title: string; isDone: boolean; createdAt: string; }

export type TaskToggle = { id: string; isDone: boolean; }

export type TaskId = string

export type TaskCollection = { id: string; title: string; isDone: boolean; createdAt: string; }[]
