FROM node:10-alpine
WORKDIR usr/src/app
COPY package.json .
RUN npm install
COPY dist dist
RUN mkdir prisma
COPY prisma/schema.prisma prisma/
COPY prisma/migrations prisma/migrations/
EXPOSE 4000
CMD ["npm", "run", "start:docker-local"]
