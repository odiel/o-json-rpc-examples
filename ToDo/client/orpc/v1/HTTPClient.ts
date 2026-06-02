import type { AbstractLogger, ClientOptions, ProcedureRequest, Request, Response } from './common.ts';
import { ConsoleLogger, LogLevel } from './common.ts';
import type * as Resource from './resources.ts';

export class HTTPClient {
    private logger: AbstractLogger;

    private apiVersion = 'v1';

    private procedures: ProcedureRequest[] = [];

    constructor(
        private host: string,
        private port: number,
        options?: {
            logger?: AbstractLogger;
        },
    ) {
        this.logger = options?.logger ?? new ConsoleLogger(LogLevel.INFO);
    }

    public addTask(input: Resource.Task, options?: { procedureId?: string }) {
        this.addProcedure('addTask', options?.procedureId || 'addTask', input);
        return this;
    }

    public toggleTask(input: Resource.TaskToggle, options?: { procedureId?: string }) {
        this.addProcedure('toggleTask', options?.procedureId || 'toggleTask', input);
        return this;
    }

    public deleteTask(input: Resource.TaskId, options?: { procedureId?: string }) {
        this.addProcedure('deleteTask', options?.procedureId || 'deleteTask', input);
        return this;
    }

    public getTasks(input?: undefined, options?: { procedureId?: string }) {
        this.addProcedure('getTasks', options?.procedureId || 'getTasks', input);
        return this;
    }

    public async send(options?: ClientOptions): Promise<Response> {
        const url = 'http://' + this.host + ':' + this.port;
        const payload = this.buildRequestPayload([...this.procedures], options);
        this.procedures = [];

        this.logger.debug('Sending payload to ' + url, { payload: payload });

        let response;

        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const json = await response.json();

            this.logger.debug('Response payload received', { payload: json });

            return json;
        } catch (error) {
            this.logger.error('Request error', { error });

            throw error;
        }
    }

    private addProcedure(name: string, id: string, input?: unknown) {
        const procedure: ProcedureRequest = { id, name };

        if (input) {
            procedure.input = input;
        }

        this.procedures.push(procedure);
    }

    private buildRequestPayload(procedures: ProcedureRequest[], options?: ClientOptions): Request {
        const request: Request = {
            protocol: 'v1',
            api: this.apiVersion,
            procedures,
        };

        if (options) {
            request.options = {};

            if (options.authentication) {
                request.options.authentication = {
                    scheme: options.authentication.scheme,
                    token: options.authentication.token,
                    token_format: options.authentication.token_format,
                };
            }

            if (options.execution) {
                request.options.execution = options.execution;
            }
        }

        return request;
    }
}
