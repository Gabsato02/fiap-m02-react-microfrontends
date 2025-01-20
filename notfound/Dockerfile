# Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie apenas os arquivos necessários para instalar dependências inicialmente
COPY package*.json ./

# Instale as dependências de produção e desenvolvimento
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . .

# Compile o projeto (build de produção)
RUN npm run build

# Exponha a porta utilizada pelo servidor
EXPOSE 9001

# Comando de inicialização para iniciar o servidor
CMD ["npm", "start", "--", "--port", "9001"]
