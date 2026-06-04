import { JSX } from 'preact';
import { signal } from '@preact/signals';
import { signedUser, userAccount } from '../state/index.ts';
import { ORPCClient, UserAccount } from '../../orpc/index.ts';

const isSubmitting = signal(false);
const selectedOption = signal('');

export function CredentialsInfo() {
    const onSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        isSubmitting.value = true;

        if (signedUser.value) {
            let result;

            switch (selectedOption.value) {
                case 'session':
                    result = await ORPCClient.getUserAccount().send({
                        authentication: {
                            scheme: 'session',
                            token: signedUser.value.auth.sessionId,
                            token_type: 'plain-text',
                        },
                    });
                    break;
                case 'api_key':
                    result = await ORPCClient.getUserAccount().send({
                        authentication: {
                            scheme: 'api_key',
                            token: signedUser.value.auth.apiKey,
                            token_type: 'base64',
                        },
                    });

                    break;
                case 'access_token':
                    result = await ORPCClient.getUserAccount().send({
                        authentication: {
                            scheme: 'access_token',
                            token: signedUser.value.auth.tokens.access,
                            token_type: 'jwt',
                        },
                    });

                    break;
            }

            if (result && 'result' in result.procedures.getUserAccount) {
                userAccount.value = result.procedures.getUserAccount.result as UserAccount;
            }
        }

        isSubmitting.value = false;
    };

    const onSelectChange = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        selectedOption.value = e.currentTarget.value;
    };

    return (
        <div className='credentialsInfo'>
            <div>
                <h3>Authenticated user id: {signedUser.value!.userId}</h3>
            </div>
            <div>
                <h4>For a follow up request to access protected content use your preferred authentication mechanism below:</h4>
            </div>
            <div>
                <form onSubmit={onSubmit}>
                    <fieldset disabled={isSubmitting}>
                        <select name='authMechanism' onChange={onSelectChange} value={selectedOption.value}>
                            <option value='session'>Session Id</option>
                            <option value='api_key'>Api Key</option>
                            <option value='access_token'>Access token</option>
                        </select>
                        <button type='submit' className='credentialsInfoBtn'>Get info</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}
