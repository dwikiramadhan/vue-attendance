FROM node:16

RUN npm install -g http-server

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

COPY . ./

# RUN npm install -g @vue/cli-service
RUN npm i

RUN npm run build:prod

EXPOSE 2000
#CMD [ "http-server", "dist" ]
# CMD ["npm", "run", "serve"]
CMD npm run preview
