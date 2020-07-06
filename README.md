# one-day-radio-api

The one day radio API

## How to run the project locally

### Pre-requisites

1. Install `migrate-mongo` by running `npm install -g migrate-mongo`

### NOTES:

1. Local database credentials can be found in the `docker-compose.yml` file, look for `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD`

### Step by step instructions:

1. Make a copy of `.env-template` and name it `.env`
2. Make a copy of `./migrations/db-config.template.js` and name it `./migrations/db-config.js`
3. Fill these 2 files with appropriate values (for local dev usually whatever is in the template file is just what you need)
4. Run `nvm use` to install the nodejs supported. In case you don't use nvm or any node version manager, please check the `.nvmrc` file and install the correct node version manually.
5. On your terminal run `make local`. Running this will spin up a local mongo database, it will feed the database with some users and will start the serverless project offline.
6. If you need to re-start the server without re-spinning the database just run `yarn start`

The project will start running on url `http://localhost:3000/dev/graphql`.
Test it using your REST client of preference. Insomnia is very much recommended: https://insomnia.rest/

## Running tests

1. Start the local database `make setup-local-db`
2. To run all tests run `yarn test`
3. To run all tests in watch mode run `yarn test:watch`
4. To run the test coverage report run `yarn test:coverage`

## Updating npm package dependencies

Run `yarn update-all` to interactively check what npm packages can be updated to newer versions.
Please try to do this as often as possible! :)

## Migrations

1. To run all migrations run `make migrations-up`
2. To create a new migration file run `migrate-mongo create <name>`

## Spotify

This is the entire list of spotify scopes we use in the app:

```
user-read-private user-read-email playlist-modify-private playlist-read-private user-read-playback-state playlist-modify-public user-modify-playback-state
```
