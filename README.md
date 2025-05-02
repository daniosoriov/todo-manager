# TODO Task Manager

A simple and efficient TODO Task Manager RESTful API to help you organize and manage your tasks.

This project is built with Node.js, Express, and MongoDB, providing a clean and easy-to-use tech stack.

Testing is done using Vitest, ensuring that the API is reliable and bug-free.

This repository supports a set of tutorials:

| Article                                                                                               | Tag                                                                                                       |
|-------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| [Setting up the API](https://danioshi.substack.com/p/build-your-first-restful-api-with?r=i9w8u)       | [v1-api-initial](https://github.com/daniosoriov/todo-manager/releases/tag/v1-api-initial)                 |
| [Adding Tests with Vitest](https://danioshi.substack.com/p/how-to-test-your-nodejs-restful-api)       | [v2-tests](https://github.com/daniosoriov/todo-manager/releases/tag/v2-tests)                             |
| [Authentication and Authorization](https://danioshi.substack.com/p/securing-your-nodejs-api-with-jwt) | [v3-auth](https://github.com/daniosoriov/todo-manager/releases/tag/v3-auth)                               |                                                                                   |
| Authentication Refresh Tokens - (Coming soon...)                                                      | [v4-auth-refresh-tokens](https://github.com/daniosoriov/todo-manager/releases/tag/v4-auth-refresh-tokens) |
| Docker Containerization - (Coming soon...)                                                            | v5-docker                                                                                                 |
| Authentication Role Based - (Coming soon...)                                                          | v6-auth-role                                                                                              |
| Advanced Features - (Coming soon...)                                                                  | v7-features                                                                                               |

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
