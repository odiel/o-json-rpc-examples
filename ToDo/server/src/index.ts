import { Server } from '@o-json-rpc/o-json-rpc-ts';
import type { ProcedureName } from '@o-json-rpc/o-json-rpc-ts';
import { generateClients } from '@o-json-rpc/o-json-rpc-clients';

import { addTaskFn, deleteTaskFn, getTasksFn, TaskCollectionResource, TaskIdResource, TaskResource, TaskToggleResource, toggleTaskFn } from './procedures.ts';

const host = 'localhost';
const port = 7000;

const server = new Server({
    host,
    port,
});

server
    .registerResource('v1', TaskResource.name, TaskResource.schema)
    .registerResource('v1', TaskToggleResource.name, TaskToggleResource.schema)
    .registerResource('v1', TaskIdResource.name, TaskIdResource.schema)
    .registerResource('v1', TaskCollectionResource.name, TaskCollectionResource.schema)
    .registerProcedure('v1', 'addTask' as ProcedureName, addTaskFn, { input: TaskResource.name })
    .registerProcedure('v1', 'toggleTask' as ProcedureName, toggleTaskFn, { input: TaskToggleResource.name })
    .registerProcedure('v1', 'deleteTask' as ProcedureName, deleteTaskFn, { input: TaskIdResource.name })
    .registerProcedure('v1', 'getTasks' as ProcedureName, getTasksFn, { output: TaskCollectionResource.name })
    .start();

const scriptDir = import.meta.dirname;
generateClients(server.getAPIDefinition(), [{ language: 'typescript', path: `${scriptDir}/../../client/orpc` }]);
