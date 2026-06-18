import * as z from 'zod';
import { ProcedureRequestContext, ProcedureResult, RequestContext, ResourceDefinition, ResourceName } from '@o-json-rpc/o-json-rpc-ts';
import { generateApiKey, generateSessionId, generateTokens } from './utils.ts';

// Zod schemas
const zUserCredentials = z.object({
    username: z.string(),
    password: z.string(),
});

const zSignedUser = z.object({
    userId: z.string(),
    auth: z.object({
        apiKey: z.string(),
        sessionId: z.string(),
        tokens: z.object({
            access: z.string(),
            refresh: z.string(),
        }),
    }),
});

export const zUserAccount = z.object({
    id: z.string(),
    username: z.string(),
    signedInDate: z.iso.datetime(),
});

// Api resource definition

export const UserCredentialsResource: ResourceDefinition = {
    name: 'UserCredentials' as ResourceName,
    schema: zUserCredentials,
};

export const SignedUserResource: ResourceDefinition = {
    name: 'SignedUser' as ResourceName,
    schema: zSignedUser,
};

export const UserAccountResource: ResourceDefinition = {
    name: 'UserAccount' as ResourceName,
    schema: zUserAccount,
};

// TS Types

type UserCredentials = z.infer<typeof zUserCredentials>;
type SignedUser = z.infer<typeof zSignedUser>;
type UserAccount = z.infer<typeof zUserAccount>;
type UserId = string;

// Local DB definition
const superDontTellAnyoneSecretKey = new TextEncoder().encode('This is a super secret key!');

const authenticatedUsers: Record<UserId, UserAccount> = {};

const sessionsMap: Record<string, UserId> = {};
const apiKeysMap: Record<string, UserId> = {};
const accessTokensMap: Record<string, UserId> = {};

// Procedures definition

export async function signIn(
    procedureContext: ProcedureRequestContext,
    _context: RequestContext,
): Promise<ProcedureResult> {
    if (!procedureContext.input) {
        return {
            error: {
                code: 'PROCEDURE:BAD_CREDENTIALS',
                message: 'Bad credentials.',
            },
        };
    }

    const input = procedureContext.input as UserCredentials;

    if (input.username !== 'admin' && input.password !== 'admin') {
        return {
            error: {
                code: 'PROCEDURE:BAD_CREDENTIALS',
                message: 'Bad credentials.',
            },
        };
    }

    const userId = crypto.randomUUID();
    const apiKey = generateApiKey();
    const sessionId = generateSessionId();
    const tokens = await generateTokens(userId, superDontTellAnyoneSecretKey);

    const signedUser = {
        userId,
        auth: {
            apiKey,
            sessionId,
            tokens,
        },
    };

    authenticatedUsers[userId] = {
        id: userId,
        username: input.username,
        signedInDate: new Date().toISOString(),
    };

    sessionsMap[sessionId] = userId;
    apiKeysMap[apiKey] = userId;
    accessTokensMap[tokens.access] = userId;

    return {
        result: signedUser,
    };
}

export function getUserAccount(
    _procedureContext: ProcedureRequestContext,
    context: RequestContext,
): ProcedureResult {
    const auth = context.request.options.authentication;

    if (!auth) {
        return {
            error: {
                code: 'PROCEDURE:NOT_AUTHORIZED',
                message: 'Not authorized',
            },
        };
    }

    let userId: string | undefined;

    switch (auth.scheme) {
        case 'session':
            userId = sessionsMap[auth.token];
            break;
        case 'api_key':
            userId = apiKeysMap[auth.token];
            break;
        case 'access_token':
            userId = accessTokensMap[auth.token];
            break;
        default:
            return {
                error: {
                    code: 'PROCEDURE:NOT_AUTHORIZED',
                    message: 'Not authorized',
                },
            };
    }

    const user = authenticatedUsers[userId];

    if (!user) {
        return {
            error: {
                code: 'PROCEDURE:NOT_AUTHORIZED',
                message: 'Not authorized',
            },
        };
    }

    return {
        result: user,
    };
}
