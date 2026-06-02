## Requirements

- [Deno runtime](https://deno.com)

## ToDo app

This is a simple ToDo application that allows to add, mark as completed and delete tasks added to a list.
It uses the auto generated ORPC HTTPClient.

```shell
deno task start-todo-server
```

starts the server instance; and

```shell
deno task start-todo-client
```

starts the client instance.

## Chat app

This is a simple Chat application that allows to set an alias before joining a common chat room; users can send messages and disconnect from the chat.
It uses both the auto generated ORPC HTTPClient and WSClient clients.

```shell
deno task start-chat-server
```

starts the server instance; and

```shell
deno task start-chat-client
```

starts the client instance.

## Additional notes

Server instances are accessible by default at `localhost:7000` and should allow both HTTP and Websocket requests. The API definition should be accessible at http://localhost:7000/definition .

The client instance should be accessible by default at http://127.0.0.1:5173/, check the output in the terminal in case the port is already in use.
