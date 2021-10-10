# Phoenix

RC Tech Club central API server for applications

#### Development setup

##### Dependencies

- Prisma CLI
- npm
- Docker and docker-compose

1. After you clone the repository, you should notice a `.env.sample` file in the root directory. Copy that file as `.env`, and put in the values below.

```
# database
DATABASE_URL=postgresql://prisma:prisma@localhost:5432/prisma?schema=prisma$default
DB_USER=prisma
DB_PASSWORD=prisma

# application
PHOENIX_SECRET=phoenix
GOOGLE_CLIENT_ID=798725565697-sfibjdadpcan9ks908dnl8p5k1dncmoq.apps.googleusercontent.com
NODEMAILER_PASSWORD=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SLS_SECRET=sls-secret
```

2. Once you have the above, you will need to deploy migrations to the postgres database using `prisma migrate`.

```$xslt
# Spin up the postgres database
docker-compose up -d    # Runs in detached mode
# Migrate
npx prisma migrate deploy
```

3. Generate prisma client based on the database schema.

```$xslt
# Generate
npx prisma generate
```

4. Start the server in `dev` mode.

```sh
npm run dev
```

5. To test your graphql resolvers with the [graphql playground](http://localhost:4000/graphql), spin up the server with `npm start`, and initiate a local instance of [ladybird](https://github.com/rcltech/ladybird). Login with ladybird, so that your auth token is stored in cookies. To verify if your token is present, open your browser's developer console, and look into `application cookies`; our token is stored as `RCTC_USER`.

Open the graphql playground, and change your settings for `request-credentials` from the default `omit` to `same-origin`.

![graphql_playground_settings](./docs/graphql_playground_settings.png)

Make sure to save your settings.
