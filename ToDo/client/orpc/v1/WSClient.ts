import type { AbstractLogger, ProcedureRequest, Request, SubscriptionRequest } from './common.ts';
import { ClientNotConnected, ConsoleLogger, LogLevel } from './common.ts';
import type * as Resource from './resources.ts';

export class WSClient {
    private logger: AbstractLogger;

    private apiVersion = 'v1';

    private websocket?: WebSocket;

    private onConnectedFn?: () => void;
    private onDisconnectFn?: () => void;
    private onMessageFn?: (message: unknown) => void;

    private subscriptionHandlers: {
        resource: string;
        onMessage: (message: unknown) => void | Promise<void>;
    }[] = [];

    constructor(
        private host: string,
        private port: number,
        options?: {
            logger?: AbstractLogger;
        },
    ) {
        this.logger = options?.logger ?? new ConsoleLogger(LogLevel.INFO);
    }

    public connect() {
        this.websocket = new WebSocket('ws://' + this.host + ':' + this.port);

        this.websocket.onopen = (_) => {
            if (this.onConnectedFn) {
                this.onConnectedFn();
            }

            const subscriptions: SubscriptionRequest[] = [];

            for (const handler of this.subscriptionHandlers) {
                subscriptions.push({
                    resource_name: handler.resource,
                });
            }

            const payload: Request = {
                protocol: 'v1',
                api: this.apiVersion,
                subscriptions,
            };

            this.logger.debug('Websocket: sending initial request', { payload: payload });

            this.websocket && this.websocket.send(JSON.stringify(payload));
        };

        this.websocket.onclose = (_) => {
            this.logger.info('Websocket connection closed.');

            if (this.onDisconnectFn) {
                this.onDisconnectFn();
            }

            this.websocket = undefined;
        };

        let firstMessageReceived = false;

        this.websocket.onmessage = async (websocketMessage) => {
            const data = JSON.parse(websocketMessage.data);

            if (!firstMessageReceived) {
                firstMessageReceived = true;
                this.logger.debug('Websocket: response payload received', { payload: data });
                return;
            } else {
                this.logger.debug('Websocket: message received', { payload: data });

                for (const handler of this.subscriptionHandlers) {
                    if ('resource_name' in data && handler.resource == data.resource_name) {
                        await handler.onMessage(data.resource);
                    }
                }

                if (this.onMessageFn) {
                    this.onMessageFn(data);
                }
            }
        };

        this.websocket.onerror = (error) => {
            this.logger.error('Connection error', { error });
        };
    }

    public subscribeToResource(resource: string, onMessage: (message: unknown) => void | Promise<void>) {
        this.subscriptionHandlers.push({ resource, onMessage });
        return this;
    }

    public disconnect(status: number = 1000, reason: string = 'Normal Closure') {
        if (this.websocket) {
            this.websocket.close(status, reason);
        }
    }

    public isConnected(): boolean {
        return this.websocket ? this.websocket.readyState === WebSocket.OPEN : false;
    }

    public onConnected(fn: () => void) {
        this.onConnectedFn = fn;
    }

    public onMessage(fn: (data: unknown) => void) {
        this.onMessageFn = fn;
    }

    public onDisconnect(fn: () => void) {
        this.onDisconnectFn = fn;
    }

    
    /**
     * Method for calling procedure addTask.
     * Note: the request is sent immediately
     */
    public addTask(input: Resource.Task, options?: { procedureId?: string; }) {
        if (this.isConnected()) {
            const procedure: ProcedureRequest = {
                id: options?.procedureId || 'addTask',
                name: 'addTask'
            }

            if (input) {
                procedure.input = input;
            }
        
            const payload: Request = {
                protocol: 'v1',
                api: this.apiVersion,
                procedures: [
                    procedure
                ],
            }
    
            this.logger.debug('Websocket: sending request', { payload: payload })
    
            this.websocket && this.websocket.send(JSON.stringify(payload));
        } else {
            throw new ClientNotConnected('Request for procedure [addTask] not sent; client is not connected.')
        }
    }

    /**
     * Method for calling procedure toggleTask.
     * Note: the request is sent immediately
     */
    public toggleTask(input: Resource.TaskToggle, options?: { procedureId?: string; }) {
        if (this.isConnected()) {
            const procedure: ProcedureRequest = {
                id: options?.procedureId || 'toggleTask',
                name: 'toggleTask'
            }

            if (input) {
                procedure.input = input;
            }
        
            const payload: Request = {
                protocol: 'v1',
                api: this.apiVersion,
                procedures: [
                    procedure
                ],
            }
    
            this.logger.debug('Websocket: sending request', { payload: payload })
    
            this.websocket && this.websocket.send(JSON.stringify(payload));
        } else {
            throw new ClientNotConnected('Request for procedure [toggleTask] not sent; client is not connected.')
        }
    }

    /**
     * Method for calling procedure deleteTask.
     * Note: the request is sent immediately
     */
    public deleteTask(input: Resource.TaskId, options?: { procedureId?: string; }) {
        if (this.isConnected()) {
            const procedure: ProcedureRequest = {
                id: options?.procedureId || 'deleteTask',
                name: 'deleteTask'
            }

            if (input) {
                procedure.input = input;
            }
        
            const payload: Request = {
                protocol: 'v1',
                api: this.apiVersion,
                procedures: [
                    procedure
                ],
            }
    
            this.logger.debug('Websocket: sending request', { payload: payload })
    
            this.websocket && this.websocket.send(JSON.stringify(payload));
        } else {
            throw new ClientNotConnected('Request for procedure [deleteTask] not sent; client is not connected.')
        }
    }

    /**
     * Method for calling procedure getTasks.
     * Note: the request is sent immediately
     */
    public getTasks(input?: undefined, options?: { procedureId?: string; }) {
        if (this.isConnected()) {
            const procedure: ProcedureRequest = {
                id: options?.procedureId || 'getTasks',
                name: 'getTasks'
            }

            if (input) {
                procedure.input = input;
            }
        
            const payload: Request = {
                protocol: 'v1',
                api: this.apiVersion,
                procedures: [
                    procedure
                ],
            }
    
            this.logger.debug('Websocket: sending request', { payload: payload })
    
            this.websocket && this.websocket.send(JSON.stringify(payload));
        } else {
            throw new ClientNotConnected('Request for procedure [getTasks] not sent; client is not connected.')
        }
    }

}
