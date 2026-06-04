import { userAccount } from '../state/index.ts';

export function AccountInfo() {
    return (
        <div className='credentialsInfo'>
            {userAccount.value ?
                (
                    <div>
                        UserId: {userAccount.value.id} <br />
                        Username: {userAccount.value.username} <br />
                        Signed on: {userAccount.value.signedInDate}
                    </div>
                ) :
                (
                    <div>
                        This section will display the account information once fetched. Checkout the "network" tab in the browsers developer tools for more info.
                    </div>
                )}
        </div>
    );
}
