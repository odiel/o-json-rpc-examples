import { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { Message, ORPCClient, ORPCClientWs, UsersList } from '../../orpc/index.ts';
import { signal } from '@preact/signals';
import { alias, messages, users } from '../state/index.ts';

const isSending = signal(false);
const messageInput = signal('');

export function Chat() {
    const inputMessageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputMessageRef.current && inputMessageRef.current.focus();
    }, [messageInput.value]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await ORPCClient.getUsers().getMessages().send();

            if ('result' in response.procedures.getMessages) {
                messages.value = [...response.procedures.getMessages.result as Message[]];
            }

            if ('result' in response.procedures.getUsers) {
                users.value = response.procedures.getUsers.result as UsersList;
            }
        };

        fetchData();
    }, []);

    const onSubmit = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        isSending.value = true;

        if (messageInput.value.length > 0) {
            const message = messageInput.toString();

            ORPCClientWs.sendMessage({ alias: alias.value, message });

            if (inputMessageRef.current) {
                messageInput.value = '';
                inputMessageRef.current.focus();
            }
        }

        isSending.value = false;
    };

    const onMessageInput = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        messageInput.value = event.currentTarget.value;
    };

    return (
        <div className='chat'>
            <div className='chatTopSection'>
                <div className='chatMessages'>
                    {messages.value.map(
                        (el, ix) => (
                            <ChatMessage
                                key={ix}
                                alias={el.alias}
                                createdAt={new Date(el.timestamp)}
                                message={el.message}
                            />
                        ),
                    )}
                </div>
                <div className='chatUsers'>
                    {users.value.map(
                        (el) => <User key={el.id} alias={el.alias} />,
                    )}
                </div>
            </div>

            <div className='chatBottomSection'>
                <form onSubmit={onSubmit}>
                    <fieldset disabled={isSending} className='flexBox'>
                        <input
                            autoFocus
                            ref={inputMessageRef}
                            type='text'
                            name='message'
                            placeholder='Type your message'
                            onInput={onMessageInput}
                            value={messageInput.value}
                            className='chatInputMessage'
                        />

                        <button type='submit'>
                            Send
                        </button>

                        <button
                            type='button'
                            onClick={() => {
                                ORPCClientWs.disconnect();
                            }}
                        >
                            Disconnect
                        </button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

function ChatMessage(
    { alias, createdAt, message }: {
        alias: string;
        createdAt: Date;
        message: string;
    },
) {
    return (
        <div className='chatMessage'>
            <div>{createdAt.toLocaleTimeString()} |</div>
            {alias !== 'system' && <div>{alias}:</div>}
            <div>{message}</div>
        </div>
    );
}

function User({ alias }: { alias: string }) {
    return (
        <div className='chatUser'>
            <div>{alias}</div>
        </div>
    );
}
