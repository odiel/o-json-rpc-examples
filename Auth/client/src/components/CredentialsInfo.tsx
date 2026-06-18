import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { signedUser, userAccount } from '../state/index.ts';
import { ORPCClient, UserAccount } from '../../orpc/index.ts';
import { an } from 'npm:@faker-js/faker@10.4.0/dist/airline-eVQV6kbz.d.ts';

export function CredentialsInfo() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const onSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (signedUser.value) {
            let result;

            switch (selectedOption) {
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
                userAccount.value = { ...result.procedures.getUserAccount.result as UserAccount, scheme: selectedOption };
            }
        }

        setIsSubmitting(false);
    };

    const onSelectChange = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        setSelectedOption(e.currentTarget.value);
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
                        <span>Using:</span>
                        <select name='authMechanism' onChange={onSelectChange} value={selectedOption}>
                            <option value='session'>Session Id</option>
                            <option value='api_key'>Api Key</option>
                            <option value='access_token'>Access token</option>
                        </select>
                        <button type='submit' className='credentialsInfoBtn'>Get account info</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}
