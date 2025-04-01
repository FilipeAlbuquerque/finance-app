FROM node:18 AS build

WORKDIR /app

# Copiar os arquivos de configuração e instalar dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copiar o restante dos arquivos e construir o app
COPY . .
RUN npm run build --prod

# Estágio de produção
FROM nginx:alpine

# Copiar o build da aplicação para o diretório de deploy do nginx
COPY --from=build /app/dist/finance-app /usr/share/nginx/html

# Copiar a configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Iniciar o nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
