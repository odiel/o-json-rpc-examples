import { render } from 'preact';
import './style.css';
import { AliasPrompt, Chat } from './components/index.ts';
import { isConnected } from './state/index.ts';

export function App() {
    return (
        <div className='mainContainer'>
            {isConnected.value == false && <AliasPrompt />}
            {isConnected.value == true && <Chat />}
        </div>
    );
}

const container = document.getElementById('app');

if (container) {
    render(<App />, container);
}
