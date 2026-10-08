FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install
 
RUN npm install -g pm2

COPY . .

EXPOSE 8181
EXPOSE 8182
EXPOSE 8183
EXPOSE 8184
EXPOSE 8185

CMD ["pm2-runtime", "ecosystem.config.js"]