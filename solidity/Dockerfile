
FROM node:16-alpine3.15

RUN apk add g++ make py3-pip jq

WORKDIR /app

ENV DEBUG TRUE

COPY package.json .

RUN npm install

COPY . .

RUN chmod +x run.sh
ENTRYPOINT ["./run.sh"]

# ENTRYPOINT ["npx", "hardhat", "run", "scripts/deploy.ts"]