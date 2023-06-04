FROM node:16

RUN npm install -g http-server

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

COPY . ./

RUN npm install -g
# RUN npm install @vue/cli@3.7.0 -g

# RUN npm run build:dev

EXPOSE 8686
#CMD [ "http-server", "dist" ]
CMD ["npm", "run", "dev"]
# CMD npm run preview
