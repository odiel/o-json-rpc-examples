import { Response, Task } from '../orpc/index.ts';

export function getTaskResources(response: Response | undefined) {
    if (response) {
        const procedureResult = response.procedures['getTasks'];
        if ('result' in procedureResult) {
            return procedureResult.result as Task[];
        }
    }

    return [];
}
