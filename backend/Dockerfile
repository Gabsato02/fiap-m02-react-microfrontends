# Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie apenas os arquivos necessários para instalar as dependências
COPY package*.json ./

# Instale as dependências em um estágio intermediário para aproveitar o cache
RUN npm install --production

# Copie o restante dos arquivos da aplicação
COPY . .

# Renomeie o arquivo _db.json para db.json no contêiner
RUN mv _db.json db.json

# Exponha a porta usada pela aplicação
EXPOSE 9004

# Comando de inicialização
CMD ["node", "app.js"]
