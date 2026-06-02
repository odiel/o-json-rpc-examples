import { Task as TaskType } from '../../orpc/index.ts';

export function Tasks({ tasks, onFinish, onDelete }: {
    tasks: TaskType[];
    onFinish: (task: string, isDone: boolean) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className='tasks'>
            <div>
                <h2>To Do</h2>
            </div>

            <div className='tasksContainer'>
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        onFinish={onFinish}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export function Task({ task, onFinish, onDelete }: {
    task: TaskType;
    onFinish: (task: string, isDone: boolean) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className='flexBox task'>
            <input
                className='taskCompleteBtn'
                type='checkbox'
                onChange={(e) => onFinish(task.id, e.currentTarget.checked)}
            />
            <div className='taskTitle'>
                {task.isDone ? <s>{task.title}</s> : <span>{task.title}</span>}
            </div>
            <button type='button' onClick={() => onDelete(task.id)}>
                Delete
            </button>
        </div>
    );
}
