FROM node:14-alpine
WORKDIR usr/src/app

COPY package.json .
COPY src .

RUN npm install

RUN mkdir prisma
COPY prisma/schema.prisma prisma/
COPY prisma/migrations prisma/migrations/
RUN npx prisma generate

RUN npm run build

EXPOSE 4000
CMD ["npm", "run", "start"]
