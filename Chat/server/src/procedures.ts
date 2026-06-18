import * as z from 'zod';
import { ProcedureRequestContext, ProcedureResult, RequestContext, ResourceDefinition, ResourceName, WebSocketId } from '@o-json-rpc/o-json-rpc-ts';

// Zod schemas
export const zAlias = z.string();

export const zUser = z.object({
    id: z.string(),
    alias: z.string(),
    status: z.string(),
});

export const zUsersList = z.array(
    zUser,
);

export const zInputMessage = z.object({
    alias: z.string(),
    message: z.string(),
});

export const zMessage = z.object({
    alias: z.string(),
    message: z.string(),
    timestamp: z.string().datetime(),
});

// TS types

type Alias = z.infer<typeof zAlias>;
type User = z.infer<typeof zUser>;
type InputMessage = z.infer<typeof zInputMessage>;
type ChatMessage = z.infer<typeof zMessage>;

// Api resource definition

export const AliasResource: ResourceDefinition = {
    name: 'Alias' as ResourceName,
    schema: zAlias,
};

export const UsersListResource: ResourceDefinition = {
    name: 'UsersList' as ResourceName,
    schema: zUsersList,
};

export const InputMessageResource: ResourceDefinition = {
    name: 'InputMessage' as ResourceName,
    schema: zInputMessage,
};

export const MessagesResource: ResourceDefinition = {
    name: 'Messages' as ResourceName,
    schema: z.array(zMessage),
};

export const UserResource: ResourceDefinition = {
    name: 'User' as ResourceName,
    schema: zUser,
};

export const MessageResource: ResourceDefinition = {
    name: 'Message' as ResourceName,
    schema: zMessage,
};

// Local DB definition
const joinedUsers: Record<Alias, User> = {};
const wsConnections: Record<WebSocketId, Alias> = {};
const messages: ChatMessage[] = [];

// Procedures definition

export function createAlias(
    procedureContext: ProcedureRequestContext,
    context: RequestContext,
): ProcedureResult {
    if (procedureContext.input) {
        const alias = procedureContext.input as Alias;

        if (context.websocketId) {
            joinedUsers[alias] = { id: context.websocketId, alias, status: 'joined' };
            wsConnections[context.websocketId] = alias;
        } else {
            joinedUsers[alias] = { id: crypto.randomUUID(), alias, status: 'joined' };
        }

        const message = {
            alias: `system`,
            message: `${alias} joined the chat!`,
            timestamp: new Date().toISOString(),
        };

        messages.push(message);

        context.notifySubscribers(MessageResource.name, message);
        context.notifySubscribers(UserResource.name, joinedUsers[alias]);
    }
}

export function getUsers(
    _procedureContext: ProcedureRequestContext,
    _context: RequestContext,
): ProcedureResult {
    const results = [];

    for (const entry of Object.values(joinedUsers)) {
        results.push(entry);
    }

    return {
        result: results,
    };
}

export function getMessagesFn(
    _procedureContext: ProcedureRequestContext,
    _context: RequestContext,
): ProcedureResult {
    return {
        result: messages,
    };
}

export function sendMessageFn(
    procedureContext: ProcedureRequestContext,
    context: RequestContext,
): ProcedureResult {
    if (procedureContext.input) {
        const input = procedureContext.input as InputMessage;

        const message = {
            alias: input.alias,
            message: input.message,
            timestamp: new Date().toISOString(),
        };

        messages.push(message);

        context.notifySubscribers(MessageResource.name, message);
    }
}

export function onUserSubscriptionConnect(
    _websocketId: WebSocketId,
    _context: RequestContext,
) {}

export function onUserSubscriptionDisconnect(websocketId: WebSocketId, context: RequestContext) {
    const alias = wsConnections[websocketId];

    if (alias) {
        const user = joinedUsers[alias];

        context.notifySubscribers(UserResource.name, { ...user, status: 'left' });
        const message = {
            alias: `system`,
            message: `${alias} left the chat!`,
            timestamp: new Date().toISOString(),
        };

        messages.push(message);

        context.notifySubscribers(MessageResource.name, message);

        delete joinedUsers[alias];
    }

    delete wsConnections[websocketId];
}
