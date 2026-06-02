import { signal } from '@preact/signals';
import { Message, ORPCClientWs, User, UsersList } from '../../orpc/index.ts';

export const alias = signal('');
export const isConnected = signal(false);

export const messages = signal<Message[]>([]);
export const users = signal<UsersList>([]);

ORPCClientWs.onConnected(() => {
    isConnected.value = true;

    ORPCClientWs.createAlias(alias.value);
});

ORPCClientWs.onDisconnect(() => {
    isConnected.value = false;
});

ORPCClientWs.onMessage((_data: unknown) => {
});

ORPCClientWs
    .subscribeToResource('Message', (resource: unknown) => {
        messages.value = [...messages.value, resource as Message];
    })
    .subscribeToResource('User', (resource: unknown) => {
        const userResource = resource as User;

        if (userResource.status == 'joined') {
            users.value = [...users.value, userResource];
        }

        if (userResource.status == 'left') {
            const index = users.value.findIndex((e) => e.alias == userResource.alias);

            if (index !== -1) {
                const usersCopy = [...users.value];
                usersCopy.splice(index, 1);
                users.value = usersCopy;
            }
        }
    });
