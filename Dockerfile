FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de dependências primeiro (cache do Docker)
COPY package*.json ./

RUN npm install

# Copia o restante do projeto
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
