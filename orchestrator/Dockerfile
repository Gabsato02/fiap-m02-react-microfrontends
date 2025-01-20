# Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instale as dependências de produção e desenvolvimento
RUN npm install --no-cache

# Copie o restante dos arquivos do projeto
COPY . .

# Compile o projeto para produção
RUN npm run build

# Exponha a porta utilizada pela aplicação
EXPOSE 9000

# Comando de inicialização para o servidor Webpack
CMD ["npm", "start", "--", "--port", "9000"]
