FROM node:lts-alpine
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
WORKDIR /app
COPY package*.json prisma/schema.prisma ./
RUN npm install && npm cache clean --force
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]