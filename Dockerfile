FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apt-get update && apt-get install build-essential -y

#RUN apt-get install -y postgresql-client-9.5

#RUN apt-get -y install postgresql


# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
# RUN chmod +x /wait

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# EXPOSE 3000
# EXPOSE 5432

ENV NODE_ENV production


CMD [ "node", "index.js" ]