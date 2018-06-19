# Start from the basic nodedjs image at this specific version
FROM node:8

WORKDIR /usr/src/app

# Copy our dependency lists
COPY package.json ./

RUN yarn install

# Copy all your stuff to the image
COPY . .

# Appease EB that was only meant for webapps
EXPOSE 8888

CMD ["yarn", "start"]
