# Start from the basic nodedjs image at this specific version
FROM node:8

WORKDIR /usr/src/app

# Install MongoDB Tools (mongodump)
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list
RUN apt-get update
RUN apt-get install -y mongodb-org-tools

# Copy our dependency lists
COPY package.json ./

RUN yarn install

# Copy all your stuff to the image
COPY . .

# Appease EB that was only meant for webapps
EXPOSE 8888

CMD ["yarn", "start"]
