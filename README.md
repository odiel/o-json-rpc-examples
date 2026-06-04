## Intro

This repo contains application examples to demonstrate how to use [O-JSON-RPC-TS](https://github.com/odiel/o-json-rpc-ts) implementation of [O-JSON-RPC](https://github.com/odiel/o-json-rpc) protocol when building both server side APIs and client applications to interact with the APIs.

## Requirements

- [Deno runtime](https://deno.com)

## ToDo app

This is a simple ToDo application that allows to add, mark as completed and delete tasks added to a list.

To start the server instance use:
```shell
deno task start-todo-server
```

To start the client application use:
```shell
deno task start-todo-client
```

## Chat app

Simple Chat application that asks the user for an alias before joining a common chat room. Users can send messages and disconnect from the chat.

To start the server instance use:
```shell
deno task start-chat-server
```

To start the client application use:
```shell
deno task start-chat-client
```

## Auth app

This example demonstrate how to use the different authentication schemes O-JSON-RPC supports by definition.

To start the server instance use:
```shell
deno task start-auth-server
```

To start the client application use:
```shell
deno task start-auth-client
```


## Additional notes

Server instances are accessible by default at `localhost:7000` and should allow both HTTP and Websocket requests. \ 
The API definition should be accessible at http://localhost:7000/definition

The client instance should be accessible by default at http://localhost:5173/, check the output in the terminal for more information.