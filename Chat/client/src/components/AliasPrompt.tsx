import { JSX } from 'preact';
import { signal } from '@preact/signals';
import { ORPCClientWs } from '../../orpc/index.ts';
import { useEffect } from 'preact/hooks';
import { alias } from '../state/index.ts';

const isSubmitting = signal(false);

export function AliasPrompt() {
    const onSubmit = (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        isSubmitting.value = true;

        ORPCClientWs.connect();
    };

    const onUserAliasInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        alias.value = e.currentTarget.value;
    };

    useEffect(() => {
        isSubmitting.value = false;
        alias.value = '';
    }, []);

    return (
        <div className='newTask'>
            <form onSubmit={onSubmit}>
                <fieldset disabled={isSubmitting} className='flexBox'>
                    <div className='newTaskInput'>
                        <input
                            type='text'
                            name='alias'
                            placeholder='Enter an alias'
                            onInput={onUserAliasInput}
                            value={alias.value}
                        />
                    </div>
                    <div className='newTaskSubmit'>
                        <button
                            type='submit'
                            disabled={alias.value.length < 3}
                        >
                            To the chat room
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
