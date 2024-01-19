FROM node

WORKDIR /economic-bot

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]