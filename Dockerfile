FROM node:16

RUN npm install -g http-server

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

COPY . ./

RUN npm install
# RUN npm install @vue/cli@3.7.0 -g

RUN npm run build:prod

EXPOSE 8686
#CMD [ "http-server", "dist" ]
#CMD ["npm", "run", "serve"]
CMD npm run preview
