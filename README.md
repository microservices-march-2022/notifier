# Notifier

This is the backend for the notifier app for the NGINX Microservices March Demo Architecture

## Responsibility

This service listens for notifications of events in the system that might need a notification sent to a user. It then dispatches notifications based on the user's notification preferences.

## Getting started
This project uses NodeJS at the version specified in `.tool-versions`.  It is recommended that you use [asdf](https://asdf-vm.com/guide/getting-started.html) to manage your NodeJS version.  Once you have `asdf` installed, you can run `asdf install` to automatically have the version of NodeJS required by this project.

<details>
<summary>Why `asdf`?</summary>
In a microservices environment, you may have to work on projects that use different versions of a runtime like NodeJS, or use a different language altogether!

[asdf](https://asdf-vm.com/guide/getting-started.html) is a single tool that lets you manage multiple versions of different languages in isolation and will automatically switch to the required version in any directory that has a `.tool-versions` file.

This is helpful in getting closer to [Dev/prod parity](https://12factor.net/dev-prod-parity) in a microservices environment. As you can see in this project, the CI uses the same version called out in `.tool-versions` to run the tests, and the Docker image that is used to run the program also references the `.tool-versions` file.

This way, if we use `asdf` we're guaranteed to be developing, testing, and releasing to a consistent version of NodeJS.
</details>

You can also install NodeJS by other means - just reference the version number in the `.tool-versions` file.

1. Run `docker-compose up` to start the postgres database
1. From the [platform](https://github.com/microservices-march-2022/platform) repo, also run `docker-compose up`
1. Create the db: `PGDATABASE=postgres node bin/create-db.mjs`
1. Create the tables `node bin/create-schema.mjs`
1. Supply seed data `node bin/create-seed-data.mjs`
1. Run `node index.mjs` to start the service

## Using the Service
There is no configuration needed to run this service. See the usage information for the [messenger service](https://github.com/microservices-march-2022/messenger).  When a new message is sent via that service, you should see log entries in this service indicating what fake notifications might have been sent.

## Application Notes
The required configuration for this application can be understood by viewing the [configuration schema](/config/config.mjs)

This application serves as a simple example of a service handling events from a message queue and having its own database.  However, it intentionally does not do a few things for the sake of simplicity:

* Notifications are not actually sent
* A log of sent notifications is not kept in a queryable way - however it is possible to reference the logs to see dispatch

## A note on code and style

The code for this example is written in a style that not in line with application development best practices.

Instead, it is optimized to be quickly understood by those seeking to understand the Microservices March Demo Architecture without assuming special familiarity with:

- Javascript
- NodeJS
- Express

Therefore, we've opted to:

- Avoid frameworks that have domain specific languages (ie, database libraries)
- Avoid splitting up code into many different files

## Development

Read the [`CONTRIBUTING.md`](https://github.com/microservices-march-2022/notifier/blob/main/CONTRIBUTING.md) file.

## License

[Apache License, Version 2.0](https://github.com/microservices-march-2022/notifier/blob/main/LICENSE)

&copy; [F5 Networks, Inc.](https://www.f5.com/) 2022
