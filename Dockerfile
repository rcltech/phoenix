FROM node:14-alpine
WORKDIR usr/src/app

COPY package.json .
RUN npm install

COPY src src
COPY prisma prisma
COPY tsconfig.json .
RUN npx prisma generate

RUN npm run build

EXPOSE 4000
CMD ["npm", "run", "start"]
