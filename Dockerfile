FROM node:22-bullseye
WORKDIR /usr/src/app
RUN npm install -g nodemon
COPY package*.json ./
RUN npm install --include=dev
COPY . .
EXPOSE 3000

CMD ["nodemon", "--watch", "src/**/*.ts", "--exec", "npx", "ts-node", "-r", "tsconfig-paths/register", "src/app.ts"]
