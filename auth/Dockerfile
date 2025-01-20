FROM node:18
WORKDIR /app
COPY . .
RUN npm install --no-cache
RUN npm run build
EXPOSE 9002
CMD ["npm", "start", "--", "--port", "9002"]