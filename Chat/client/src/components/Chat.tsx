import { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Message, ORPCClient, ORPCClientWs, User, UsersList } from '../../orpc/index.ts';
import { alias, messages, users } from '../state/index.ts';

export function Chat() {
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState('');

    const inputMessageRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputMessageRef.current && inputMessageRef.current.focus();
    }, [message]);

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
        setIsSending(true);

        if (message.length > 0) {
            ORPCClientWs.sendMessage({ alias: alias.value, message });
            setMessage('');
        }

        setIsSending(false);
    };

    const onMessageInput = (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        setMessage(event.currentTarget.value);
    };

    return (
        <div className='chat'>
            <div className='chatTopSection'>
                <div className='chatMessages'>
                    {messages.value.map(
                        (el: Message, ix: number) => (
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
                        (el: User) => <UserComponent key={el.id} alias={el.alias} />,
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
                            value={message}
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

function UserComponent({ alias }: { alias: string }) {
    return (
        <div className='chatUser'>
            <div>{alias}</div>
        </div>
    );
}
