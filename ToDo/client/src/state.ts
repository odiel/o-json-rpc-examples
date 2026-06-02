import { Task } from '../orpc/index.ts';
import { signal } from '@preact/signals';

export const tasksSignal = signal<Task[]>([]);
