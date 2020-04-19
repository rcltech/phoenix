# Phoenix

RC Tech Club central API server for applications

#### Development setup

##### Dependencies

- Prisma CLI
- npm
- Docker and docker-compose

1. After you clone the repository, you will notice two `.env.sample` files, one in `root` directory and the other in `prisma` 
directory. Make sure that you create a `.env` files in those places.

Sample `.env` file in `root`:
```
PRISMA_SECRET=secret123
PRISMA_HOST=http://localhost:4466/prisma
GOOGLE_CLIENT_ID=798725565697-sfibjdadpcan9ks908dnl8p5k1dncmoq.apps.googleusercontent.com
```

Sample `.env` file in `prisma`:
```$xslt
PRISMA_MANAGEMENT_API_SECRET=secret123
PRISMA_HOST=http://localhost:4466/prisma
PRISMA_SECRET=secret123
DB_HOST=postgres
DB_USER=prisma
DB_PASSWORD=prisma
``` 

2. Once you have the above, you will need to deploy the `prisma` server locally:
```$xslt
cd prisma
docker-compose up -d    # Runs in detached mode
prisma deploy
```

Also, you have to obtain a unique prisma token.
```$xslt
cd prisma
prisma token    # get token
```
Open the [admin console](http://localhost:4466/prisma/_admin). Copy and paste the token into the error popup to start using admin rights for database manipulation.

3. Now that the graphql server is running and deployed, we can generate prisma client for phoenix and start phoenix.
```$xslt
cd prisma
prisma generate
cd ..
npm run build
npm start
```

4. To test your graphql resolvers with the [graphql playground](http://localhost:4000/graphql), spin up the server with `npm start`, and initiate a local instance of [ladybird](https://github.com/rcltech/ladybird). Login with ladybird, so that your auth token is stored in cookies. To verify if your token is present, open your browser's developer console, and look into `application cookies`; our token is stored as `RCTC_USER`.

Open the graphql playground, and change your settings for `request-credentials` from the default `omit` to `same-origin`.

![graphql_playground_settings](./docs/graphql_playground_settings.png)

Make sure to save your settings.
