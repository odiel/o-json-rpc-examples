import { JSX } from 'preact';
import { signal } from '@preact/signals';
import { ORPCClient, SignedUser } from '../../orpc/index.ts';
import { useEffect } from 'preact/hooks';
import { signedUser } from '../state/index.ts';

const isSubmitting = signal(false);
const errorMessage = signal('');

const username = signal('');
const password = signal('');

export function CredentialsPrompt() {
    const onSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        isSubmitting.value = true;
        errorMessage.value = '';

        const result = await ORPCClient.signIn({ username: username.value, password: password.value }).send();
        if ('error' in result.procedures['signIn']) {
            errorMessage.value = 'Wrong credentials!';
        }

        if ('result' in result.procedures['signIn']) {
            signedUser.value = result.procedures['signIn']!.result! as SignedUser;
        }

        isSubmitting.value = false;
    };

    const onUsernameInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        username.value = e.currentTarget.value;
    };

    const onPasswordInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        password.value = e.currentTarget.value;
    };

    useEffect(() => {
        isSubmitting.value = false;
        username.value = '';
    }, []);

    return (
        <div className='newTask'>
            <form onSubmit={onSubmit}>
                <div>
                    <div>
                        <h3>Use admin/admin to authenticate.</h3>
                    </div>
                </div>
                <fieldset disabled={isSubmitting} className='credentialsPrompt'>
                    <input
                        type='text'
                        name='username'
                        placeholder='Username'
                        onInput={onUsernameInput}
                        value={username.value}
                    />

                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        onInput={onPasswordInput}
                        value={password.value}
                    />

                    <button
                        type='submit'
                        disabled={username.value.length < 3 || password.value.length < 3}
                    >
                        Sign in
                    </button>
                </fieldset>
            </form>

            {errorMessage.value && (
                <div>
                    <h5>{errorMessage.value}</h5>
                </div>
            )}
        </div>
    );
}
