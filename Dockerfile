FROM node:14-alpine
WORKDIR usr/src/app

COPY package.json .

RUN npm install

COPY dist dist

RUN mkdir prisma
COPY prisma/schema.prisma prisma/
COPY prisma/migrations prisma/migrations/
RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "run", "start"]
