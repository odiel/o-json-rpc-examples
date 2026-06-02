import { HTTPClient, WSClient } from './v1/index.ts';
export * from './v1/resources.ts';
export * from './v1/common.ts';

const host = 'localhost';
const port = 7000;

export const ORPCClient = new HTTPClient(host, port);
export const ORPCClientWs = new WSClient(host, port);
