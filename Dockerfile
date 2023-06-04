FROM node:16

RUN npm install -g http-server

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm i
# RUN npm install -g @vue/cli-service
COPY . ./

RUN npm run build:prod

EXPOSE 3000
#CMD [ "http-server", "dist" ]
# CMD ["npm", "run", "serve"]
CMD npm run preview
