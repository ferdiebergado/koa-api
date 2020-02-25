# KOA-API

A REST API template using Koa js. **Work-In-Progress**

## FEATURES

- Built-in authentication
- Authorization middleware
- Awesome eslint configuration

## REQUIREMENTS

- node >= 12.16.0 <=13.0.0 (Latest LTS)
- yarn >=1.22
- postgresql 12.2-1

## DEPENDENCIES

- koa - Next generation web framework for node js
- @koa/router - Request routing
- koa-body - Parsing request body
- jsonwebtoken - JWT support
- bcrypt - Password hashing
- pg - Postgresql database access
- @hapi/joi - Request validation
- koa-logger - Logging requests
- nodemailer - Sending email
- googleapis - Oauth2 authentication
- nunjucks - Templating engine

## INSTALLATION

1. Clone the repo.

   ```bash
   git clone https://github.com/ferdiebergado/koa-api.git
   ```

2. Change directory to the cloned repo.
   ```bash
   cd koa-api
   ```
3. Login to your postgres instance and create a database.
   ```psql
   CREATE DATABASE koa;
   ```
4. Logout.
   ```psql
   QUIT;
   ```
5. Run this command to create the necessary table structure for the application using the file located in src/db/sql folder. (Be sure to review the sql statements in the said file before running the command to avoid unwanted behavior.)
   ```bash
   psql -U postgres koa < src/db/sql/user.pgsql
   ```
6. Install the dependencies.
   ```bash
   yarn
   ```

## USAGE

1. Set the following environment variables:

   Postgresql (refer to Postgresql [documentation](https://www.postgresql.org/docs/12/libpq-envars.html) for the description)

   - PGHOST
   - PGPORT
   - PGDATABASE
   - PGUSER
   - PGPASSWORD

   Google APIs (The app uses gmail to send emails. Must have a google app id. [How To](https://developers.google.com/identity/protocols/OAuth2))

   - CLIENT_ID
   - CLIENT_SECRET
   - REFRESH_TOKEN

   Application

   - APP_KEY (a cryptographically secure random string)
   - HOST (host [default: localhost])
   - PORT (port to use [default: 3000])
   - MAIL_FROM (the from address when sending emails)

2) Start application.

   Development:

   ```bash
   yarn run dev
   ```

   Production:

   ```bash
   yarn start
   ```

3) Use a REST client to play with the api on http://localhost:3000.

   ```bash
   curl http://localhost:3000

   {"message": "API v.0.0.1"}
   ```

## TEST

Run the tests. (Set the environment variables from the USAGE section.)

```bash
yarn test
```

> **Note:** Uses [**mailhog**](https://github.com/mailhog/MailHog) as local smtp server.

## API DOCUMENTATION

Documentation can be found in the [docs](./docs) folder.

## AUTHOR

Ferdinand Saporas Bergado

Email: ferdiebergado@gmail.com

## LICENSE

[MIT](./LICENSE)
