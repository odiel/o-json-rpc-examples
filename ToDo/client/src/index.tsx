import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import './style.css';
import { NewTask, Tasks } from './components/index.ts';
import { ORPCClient } from '../orpc/index.ts';
import { tasksSignal } from './state.ts';
import { getTaskResources } from './utils.ts';

export function App() {
    useEffect(() => {
        const fetchData = async () => {
            const response = await ORPCClient.getTasks().send();
            tasksSignal.value = getTaskResources(response);
        };

        fetchData();
    }, []);

    const onFinishTask = async (id: string, isDone: boolean) => {
        const response = await ORPCClient.toggleTask({ id, isDone }).getTasks().send();
        tasksSignal.value = getTaskResources(response);
    };

    const onDeleteTask = async (id: string) => {
        const response = await ORPCClient.deleteTask(id).getTasks().send();
        tasksSignal.value = getTaskResources(response);
    };

    return (
        <div className='mainContainer'>
            <Tasks
                tasks={tasksSignal.value}
                onFinish={onFinishTask}
                onDelete={onDeleteTask}
            />

            <NewTask />
        </div>
    );
}

const container = document.getElementById('app');

if (container) {
    render(<App />, container);
}
