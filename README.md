# React Password Authentication Template

This project aims to build a full-stack template for an application that implements user sign-in and secure password authentication. The goal is for developers to be able to use this project as a baseplate to build full-stack applications that require user management and authentication, with the core features of users registering for accounts and logging in already built into the app.

This app template is designed for a React - Express.js - Knex.js - [SQL database] tech stack. The front end uses React with the react-router-dom library to handle routing. The API server runs on express.js and uses bcrypt to handle password hashing and salting. This project was originally built with a PostgreSQL database running in a Docker container, but since it uses the Knex library, the API server can connect to many different types of relational databases.

## Running the App

To get started, clone this repository. Two terminals are recommended, one for the front-end directory and one for the api-server directory. 

In **both** the front-end and api-server folders, install the required packages:

```
npm install
```

Next, start up your database. This project originally ran with a Postgresql database in a docker container. To set that up, install Docker, and use the following command: 

```
docker run --rm --name [CONTAINER NAME] -e POSTGRES_PASSWORD=[PASSWORD] -d -p 5432:5432 \
-v [HOST MACHINE FOLDER]:/var/lib/postgresql/data postgres
```

This will download the `postgres` docker image if you do not already have it, and will start running a docker container named `[CONTAINER NAME]` based on the `postgres` image. The password for the postgres user will be `[PASSWORD]`, and the database data will persist on the host machine, appearing in `[HOST MACHINE FOLDER]`. You can use any folder to store the database files, but a good recommendation for getting started is `$HOME/docker/volumes/postgres`. Note that the `--rm` flag will delete the container once Docker is shut down. You can omit this if you want the container to persist, though the container being deleted will not affect the database data. 

You can now create your database! Knex can create tables, but it needs a database to connect to. Enter the postgres container with the following command: 

```
docker exec -it [CONTAINER NAME] bash
```

This will give you a `bash` terminal in the container you just created. Now, enter the Postgresql process with the following command:

```
psql -U postgres
```

You should now be accessing Postgresql as the `postgres` user. Create a database with the following command: 

```
CREATE DATABASE [DATABASE NAME];
```

where [DATABASE NAME] is the name of the database you want to use. Don't forget the semicolon at the end. You can verify that the new database exists with the `\list` command. Leave the Postgresql process with `\quit` and leave the Docker container with `exit`.

Now, we need to point the Knex library to that database we just created. Create a file in your `api-server` directory called `.env`. This will store the environment variable used to connect to the database. This file should be listed in the `.gitignore` file for the project, as it contains secrets that should **never** be committed to a Git repository. The `.env` file should contain the following line:

```
DB_CONNECTION_STRING='postgres://postgres:[PASSWORD]@localhost/[DATABASE NAME]'
```

where [PASSWORD] is the password you defined when you ran the docker container and [DATABASE NAME] is the name of the database you created inside the container. 

Knex now has everything it needs to work! Run the following command in the `api-server` directory:

```
npm run reload-db
```

This is a custom command defined for this project. You can see in the `package.json` file that it's an alias for `npx knex migrate:rollback && npx knex migrate:latest && npx knex seed:run`. And that might tell you what it does: this migrates the database schema into the database we just created and seeds it with dummy data located in the `seeds/password-users.js` file. More info on the initial users in the **Using the App** section below.

The API server should now have everything it needs. Using two terminals, run `npm start` in both the `api-server` and `front-end` directories. 

## Using the App

TODO - describe the features of this bare-bones template.


This project is a work in progress. Check back later to see if it's complete!