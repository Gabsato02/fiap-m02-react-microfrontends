# Etapa 1: Build da aplicação
FROM node:18 AS build
WORKDIR /app

# Copiar apenas arquivos de dependências
COPY package*.json ./
RUN npm install

# Copiar o restante do código
COPY . .

# Fazer o build da aplicação
RUN npm run build

# Etapa 2: Produção
FROM node:18
WORKDIR /app

# Copiar os arquivos buildados da etapa 1
COPY --from=build /app /app

# Expor a porta 9003
EXPOSE 9003

# Comando para iniciar o servidor
CMD ["npm", "start", "--", "--port", "9003"]
