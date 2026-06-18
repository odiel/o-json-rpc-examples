import { JSX } from 'preact';
import { ORPCClient, SignedUser } from '../../orpc/index.ts';
import { useEffect, useState } from 'preact/hooks';
import { signedUser } from '../state/index.ts';

export function CredentialsPrompt() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        const result = await ORPCClient.signIn({ username: username, password: password }).send();
        if ('error' in result.procedures['signIn']) {
            setErrorMessage('Wrong credentials!');
        }

        if ('result' in result.procedures['signIn']) {
            signedUser.value = result.procedures['signIn']!.result! as SignedUser;
        }

        setIsSubmitting(false);
    };

    const onUsernameInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        setUsername(e.currentTarget.value);
    };

    const onPasswordInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        setPassword(e.currentTarget.value);
    };

    useEffect(() => {
        setIsSubmitting(false);
        setUsername('');
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
                        value={username}
                    />

                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        onInput={onPasswordInput}
                        value={password}
                    />

                    <button
                        type='submit'
                        disabled={username.length < 3 || password.length < 3}
                    >
                        Sign in
                    </button>
                </fieldset>
            </form>

            {errorMessage && (
                <div>
                    <h5>{errorMessage}</h5>
                </div>
            )}
        </div>
    );
}
