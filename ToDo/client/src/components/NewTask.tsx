import { signal } from '@preact/signals';
import { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { ORPCClient, Task } from '../../orpc/index.ts';
import { tasksSignal } from '../state.ts';
import { getTaskResources } from '../utils.ts';

const iSubmitEnabled = signal(true);
const inputText = signal('');

export function NewTask() {
    const taskTitleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        taskTitleRef.current && taskTitleRef.current.focus();
    }, [inputText.value]);

    const onSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();

        iSubmitEnabled.value = false;

        const task: Task = {
            id: crypto.randomUUID(),
            title: inputText.value,
            isDone: false,
            createdAt: new Date().toISOString(),
        };

        const response = await ORPCClient
            .addTask(task)
            .getTasks()
            .send();

        tasksSignal.value = getTaskResources(response);

        iSubmitEnabled.value = true;
        inputText.value = '';
    };

    const onInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        inputText.value = e.currentTarget.value;
        if (inputText.value.length >= 3) {
            iSubmitEnabled.value = true;
        }
    };

    return (
        <div className='newTask'>
            <form onSubmit={onSubmit}>
                <fieldset disabled={!iSubmitEnabled.value} className='flexBox'>
                    <div className='newTaskInput'>
                        <input
                            ref={taskTitleRef}
                            type='text'
                            name='title'
                            onInput={onInput}
                            value={inputText.value}
                        />
                    </div>
                    <div className='newTaskSubmit'>
                        <button type='submit'>
                            Add task
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
