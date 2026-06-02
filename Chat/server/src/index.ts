import { Server } from '@o-json-rpc/o-json-rpc-ts';
import type { Api, ProcedureName } from '@o-json-rpc/o-json-rpc-ts';
import { generateClients } from '@o-json-rpc/o-json-rpc-clients';
import {
    AliasResource,
    createAlias,
    getMessagesFn,
    getUsers,
    InputMessageResource,
    MessageResource,
    MessagesResource,
    onUserSubscriptionConnect,
    onUserSubscriptionDisconnect,
    sendMessageFn,
    UserResource,
    UsersListResource,
} from './procedures.ts';

const host = 'localhost';
const port = 7000;

const server = new Server({
    host,
    port,
});

const v1 = 'v1' as Api;

server
    .registerResource(v1, AliasResource.name, AliasResource.schema)
    .registerResource(v1, UsersListResource.name, UsersListResource.schema)
    .registerResource(v1, MessagesResource.name, MessagesResource.schema)
    .registerResource(v1, InputMessageResource.name, InputMessageResource.schema)
    .registerResource(v1, MessageResource.name, MessageResource.schema)
    .registerResource(v1, UserResource.name, UserResource.schema)
    .registerProcedure(v1, 'createAlias' as ProcedureName, createAlias, { input: AliasResource.name })
    .registerProcedure(v1, 'getUsers' as ProcedureName, getUsers, { output: UsersListResource.name })
    .registerProcedure(v1, 'getMessages' as ProcedureName, getMessagesFn, { output: MessagesResource.name })
    .registerProcedure(v1, 'sendMessage' as ProcedureName, sendMessageFn, { input: InputMessageResource.name })
    .registerSubscription(v1, MessageResource.name)
    .registerSubscription(v1, UserResource.name, {
        onClientConnect: onUserSubscriptionConnect,
        onClientDisconnect: onUserSubscriptionDisconnect,
        onResourceUpdate: (_p , _api, resName, resource) => {
            console.log(resource)

            return resource;
        }
    })
    .start();

const scriptDir = import.meta.dirname;
generateClients(server.getAPIDefinition(), [{ language: 'typescript', path: `${scriptDir}/../../client/orpc` }]);
