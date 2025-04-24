# TODO Task Manager

A simple and efficient TODO Task Manager RESTful API to help you organize and manage your tasks.

This project is built with Node.js, Express, and MongoDB, providing a clean and easy-to-use tech stack.

Testing is done using Vitest, ensuring that the API is reliable and bug-free.

This repository supports a set of tutorials:

| Article                                                                                         | Tag                                                                                       |
|-------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| [Setting up the API](https://danioshi.substack.com/p/build-your-first-restful-api-with?r=i9w8u) | [v1-api-initial](https://github.com/daniosoriov/todo-manager/releases/tag/v1-api-initial) |
| [Adding Tests with Vitest](https://danioshi.substack.com/p/how-to-test-your-nodejs-restful-api) | [v2-tests](https://github.com/daniosoriov/todo-manager/releases/tag/v2-tests)             |
| Authentication - (Coming soon...)                                                               | v3-auth                                                                                   |
| Authentication Refresh Tokens - (Coming soon...)                                                | v4-auth-refresh-tokens                                                                    |
| Authentication Role Based - (Coming soon...)                                                    | v5-auth-role                                                                              |
| Advanced Features - (Coming soon...)                                                            | v6-features                                                                               |

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

Start the server:

```bash
npm start
```

Now the server is running on `http://localhost:3000`.

## Scripts

- `npm start`: Starts the development server.
- `npm test`: Runs the tests with Vitest.
