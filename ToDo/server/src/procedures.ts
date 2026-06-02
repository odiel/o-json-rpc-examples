import * as z from 'zod';
import { ProcedureRequestContext, ProcedureResult, RequestContext, Resource, ResourceName } from '@o-json-rpc/o-json-rpc-ts';

// Zod schemas
const zTask = z.object({
    id: z.string(),
    title: z.string(),
    isDone: z.boolean(),
    createdAt: z.string(),
});

const zTaskCollection = z.array(zTask);

const zToggleTask = z.object({
    id: z.string(),
    isDone: z.boolean(),
});

const zTaskId = z.string();

// TS types

type Task = z.infer<typeof zTask>;
type TaskToggle = z.infer<typeof zToggleTask>;

// Api resource definition

export const TaskResource: Resource = {
    name: 'Task' as ResourceName,
    schema: zTask,
};

export const TaskCollectionResource: Resource = {
    name: 'TaskCollection' as ResourceName,
    schema: zTaskCollection,
};

export const TaskIdResource: Resource = {
    name: 'TaskId' as ResourceName,
    schema: zTaskId,
};

export const TaskToggleResource: Resource = {
    name: 'TaskToggle' as ResourceName,
    schema: zToggleTask,
};

// Local DB definition
const tasks: Task[] = [];

// Procedures definition

export function getTasksFn(
    _procedureContext: ProcedureRequestContext,
    _context: RequestContext,
): ProcedureResult {
    const resources: Task[] = [];

    for (const task of tasks) {
        resources.push(task);
    }

    return {
        result: resources,
    };
}

export function addTaskFn(
    procedureContext: ProcedureRequestContext,
    _context: RequestContext,
): ProcedureResult {
    if (procedureContext.input) {
        const task = procedureContext.input as Task;

        tasks.push(task);
    }
}

export function toggleTaskFn(
    procedureContext: ProcedureRequestContext,
    _context: RequestContext,
): ProcedureResult {
    if (procedureContext.input) {
        const input = procedureContext.input as TaskToggle;

        const task = tasks.find((e) => e.id == input.id);
        if (task) {
            task.isDone = input.isDone;
        }
    }
}

export function deleteTaskFn(
    procedureContext: ProcedureRequestContext,
    _context: RequestContext,
): ProcedureResult {
    if (procedureContext.input) {
        const input = procedureContext.input as string;

        const index = tasks.findIndex((e) => e.id == input);
        tasks.splice(index, 1);
    }
}
