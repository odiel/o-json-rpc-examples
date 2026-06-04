import { Server } from '@o-json-rpc/o-json-rpc-ts';
import type { Api, ProcedureName } from '@o-json-rpc/o-json-rpc-ts';
import { generateClients } from '@o-json-rpc/o-json-rpc-clients';
import { getUserAccount, SignedUserResource, signIn, UserAccountResource, UserCredentialsResource } from './procedures.ts';

const host = 'localhost';
const port = 7000;

const server = new Server({
    host,
    port,
});

const v1 = 'v1' as Api;

server
    .registerResource(v1, SignedUserResource.name, SignedUserResource.schema)
    .registerResource(v1, UserCredentialsResource.name, UserCredentialsResource.schema)
    .registerResource(v1, UserAccountResource.name, UserAccountResource.schema)
    .registerProcedure(v1, 'signIn' as ProcedureName, signIn, { input: UserCredentialsResource.name, output: SignedUserResource.name })
    .registerProcedure(v1, 'getUserAccount' as ProcedureName, getUserAccount, { output: UserAccountResource.name })
    .start();

const scriptDir = import.meta.dirname;
generateClients(server.getAPIDefinition(), [{ language: 'typescript', path: `${scriptDir}/../../client/orpc` }]);
