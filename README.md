# TODO Task Manager

A simple and efficient TODO Task Manager RESTful API to help you organize and manage your tasks.

This project is built with Node.js, Express, and MongoDB, providing a clean and easy-to-use tech stack.

Testing is done using Vitest, ensuring that the API is reliable and bug-free.

This repository supports a set of tutorials:

| Article                                                                                                                      | Tag                                                                                                       |
|------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| [Setting up the API](https://danioshi.substack.com/p/build-your-first-restful-api-with?r=i9w8u)                              | [v1-api-initial](https://github.com/daniosoriov/todo-manager/releases/tag/v1-api-initial)                 |
| [Adding Tests with Vitest](https://danioshi.substack.com/p/how-to-test-your-nodejs-restful-api)                              | [v2-tests](https://github.com/daniosoriov/todo-manager/releases/tag/v2-tests)                             |
| [Authentication and Authorization](https://danioshi.substack.com/p/securing-your-nodejs-api-with-jwt)                        | [v3-auth](https://github.com/daniosoriov/todo-manager/releases/tag/v3-auth)                               |                                                                                   |
| [Authentication Refresh Tokens](https://danioshi.substack.com/p/enhancing-your-nodejs-restful-api)                           | [v4-auth-refresh-tokens](https://github.com/daniosoriov/todo-manager/releases/tag/v4-auth-refresh-tokens) |
| [Docker Containerization](https://open.substack.com/pub/danioshi/p/dockerize-node-app-mongo-db-docker-compose-mongo-express) | [v5-docker](https://github.com/daniosoriov/todo-manager/releases/tag/v5-docker)                           |
| OpenAPI Documentation - (Coming soon...)                                                                                     | v6-openapi-doc                                                                                            |
| Valibot Schema Validation - (Coming soon...)                                                                                 | v7-valibot                                                                                                |
| Authentication Role Based - (Coming soon...)                                                                                 | v8-auth-role                                                                                              |
| Advanced Features - (Coming soon...)                                                                                         | v9-features                                                                                               |

## Getting Started

To check out a specific article's code:

Go to the URL of the desired `tag` in the repository.

For example, if you want to check out the code for the first article, go to:

```bash
git checkout v1-api-initial
```

After you check out the tag, you can run the code locally by following the installation instructions below.

## Features

- Create, retrieve, update, and delete tasks.
- Retrieve all tasks available.
- Authentication and authorization using JWTs (JSON Web Tokens).
- Refresh tokens for secure authentication, including:
    - Token expiration and renewal.
    - Rate limiting for the refresh token endpoint.
- Automated testing with Vitest.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/daniosoriov/todo-manager.git
   ```
2. Navigate to the project directory:
   ```bash
   cd todo-manager
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

This project uses **Docker** and **Docker Compose** to set up and run the server, along with a local instance of
MongoDB. A web interface for managing MongoDB is also available for convenience.

### Prerequisites

Before getting started, make sure you have the following tools installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Steps to Run the Application

#### Build the Docker Images

Run the following command to build the Docker images for the server and MongoDB:

```bash
docker-compose -f docker-compose.yaml build
```

#### Start the Containers

Once the images are built, start the containers in detached mode (background):

```bash
docker-compose -f docker-compose.yaml up -d
```

This command will:

- Launch the server accessible via the local API URL.
- Spin up a MongoDB container along with a web-based MongoDB management interface.

#### Access the Services

After starting the containers, you can access the following services:

- API: [http://localhost:3000](http://localhost:3000)
- Docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- MongoDB Web Interface (via Mongo Express): [http://localhost:8081](http://localhost:8081)

The Mongo Express interface allows you to interact with the MongoDB database directly from your browser.

#### Stopping the Containers

To stop the running containers and keep their data and state intact, use this command:

```bash
docker-compose -f docker-compose.yaml stop
```

To completely shut down and remove the containers (along with their associated networks and volumes), use:

```bash
docker-compose -f docker-compose.yaml down
```

- By default, the API will be hosted on port `3000`, and the MongoDB web interface will run on port `8081`. Make sure
  these ports are not in use before starting the containers.
- If you want to rebuild the images (e.g., after making changes to the code), run:

```bash
docker-compose -f docker-compose.yaml build --no-cache
```

## Scripts

- `npm start`: Starts the development server.
- `npm test`: Runs the tests with Vitest.
- `redocly bundle`: Bundles the OpenAPI documentation.

## API Documentation

This project uses OpenAPI to document the API endpoints.
The documentation is served using Swagger UI and is available at the `/api-docs` endpoint when the server is running.

### Viewing the API Documentation

To view the API documentation:

Start the server and on your browser navigate to:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

The Swagger UI interface allows you to:

- Browse all available API endpoints
- See request and response schemas
- Test the API endpoints directly from the browser

### Managing the API Documentation

The OpenAPI documentation is organized in a modular way, with the main file referencing path definitions in separate
files:

- `openapi/openapi.yaml`: The main OpenAPI specification file
- `openapi/paths/`: Directory containing path definitions for API endpoints

#### Updating the Documentation

To update the API documentation:

1. Edit the relevant files in the `openapi/paths/` directory
2. Bundle the documentation using Redocly CLI:
   ```bash
   npx redocly bundle
   ```
   This command reads the configuration from `redocly.yaml` and bundles the OpenAPI files into a single file at
   `src/docs/v1.0/openapi.yaml`

3. Restart the server to see the changes in the Swagger UI

#### Redocly Configuration

The project uses Redocly to manage and bundle the OpenAPI documentation.

The configuration is defined in `redocly.yaml`:

For more information on using Redocly, refer to the [Redocly CLI documentation](https://redocly.com/docs/cli/).
