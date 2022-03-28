FROM node:lts
WORKDIR /root
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]