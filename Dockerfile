FROM node:16

RUN npm install -g http-server

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

COPY . ./

# RUN npm install -g @vue/cli-service
RUN npm install -g
RUN npm i @vue/cli -g

RUN npm run build:prod

EXPOSE 8686
#CMD [ "http-server", "dist" ]
# CMD ["npm", "run", "serve"]
CMD npm run preview
