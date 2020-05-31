FROM node:10-alpine
WORKDIR usr/src/app
COPY package.json .
RUN npm install
COPY dist dist
EXPOSE 4000
CMD ["npm", "start"]
