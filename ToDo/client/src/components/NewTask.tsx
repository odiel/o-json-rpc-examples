import { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { ORPCClient, Task } from '../../orpc/index.ts';
import { tasksSignal } from '../state.ts';
import { getTaskResources } from '../utils.ts';

export function NewTask() {
    const taskTitleRef = useRef<HTMLInputElement>(null);
    const [text, setText] = useState('');
    const [iSubmitEnabled, setISubmitEnabled] = useState(true);
    const [isFormEnabled, setIsFormEnabled] = useState(true);

    useEffect(() => {
        taskTitleRef.current && taskTitleRef.current.focus();
    }, [text]);

    const onSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, Event>) => {
        e.preventDefault();

        setIsFormEnabled(false);

        const task: Task = {
            id: crypto.randomUUID(),
            title: text,
            isDone: false,
            createdAt: new Date().toISOString(),
        };

        const response = await ORPCClient
            .addTask(task)
            .getTasks()
            .send();

        tasksSignal.value = getTaskResources(response);

        setText('');
        setIsFormEnabled(true);
        setISubmitEnabled(false);
    };

    const onInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
        setText(e.currentTarget.value);
        if (text.length >= 3) {
            setISubmitEnabled(true);
        } else {
            setISubmitEnabled(false);
        }
    };

    return (
        <div className='newTask'>
            <form onSubmit={onSubmit}>
                <fieldset disabled={!isFormEnabled} className='flexBox'>
                    <div className='newTaskInput'>
                        <input
                            ref={taskTitleRef}
                            type='text'
                            name='title'
                            onInput={onInput}
                            value={text}
                        />
                    </div>
                    <div className='newTaskSubmit'>
                        <button type='submit' disabled={!iSubmitEnabled}>
                            Add task
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
