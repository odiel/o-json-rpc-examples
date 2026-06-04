import { render } from 'preact';
import './style.css';
import { AccountInfo, CredentialsInfo, CredentialsPrompt } from './components/index.ts';
import { signedUser } from './state/index.ts';

export function App() {
    return (
        <div className='mainContainer'>
            {!signedUser.value && <CredentialsPrompt />}
            {signedUser.value && (
                <>
                    <CredentialsInfo />
                    <AccountInfo />
                </>
            )}
        </div>
    );
}

const container = document.getElementById('app');

if (container) {
    render(<App />, container);
}
