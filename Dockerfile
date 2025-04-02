FROM node:18 AS build

WORKDIR /app

# Copiar os arquivos de configuração e instalar dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copiar o restante dos arquivos
COPY . .

# Configurar o ambiente para produção
ARG API_URL
ENV API_URL=${API_URL:-http://localhost:8080/api/v1}

# Verificar a estrutura de diretórios
RUN find src -name "environment*.ts" -type f | xargs ls -la

# Criar um script para modificar a URL da API
RUN echo "console.log('Configurando a URL da API para: ' + process.env.API_URL);" > set-env.js
RUN echo "const fs = require('fs');" >> set-env.js
RUN echo "let envFile = './src/environments/environment.prod.ts';" >> set-env.js
RUN echo "// Verificar se o arquivo existe no caminho padrão" >> set-env.js
RUN echo "if (!fs.existsSync(envFile)) {" >> set-env.js
RUN echo "  // Tentar encontrar o arquivo em outro lugar" >> set-env.js
RUN echo "  envFile = './src/environment.prod.ts';" >> set-env.js
RUN echo "  if (!fs.existsSync(envFile)) {" >> set-env.js
RUN echo "    envFile = './src/app/environment.prod.ts';" >> set-env.js
RUN echo "    if (!fs.existsSync(envFile)) {" >> set-env.js
RUN echo "      console.log('Arquivo environment.prod.ts não encontrado');" >> set-env.js
RUN echo "      process.exit(0);" >> set-env.js
RUN echo "    }" >> set-env.js
RUN echo "  }" >> set-env.js
RUN echo "}" >> set-env.js
RUN echo "console.log('Arquivo encontrado:', envFile);" >> set-env.js
RUN echo "let content = fs.readFileSync(envFile, 'utf8');" >> set-env.js
RUN echo "const newApiUrl = process.env.API_URL;" >> set-env.js
RUN echo "console.log('Conteúdo original:', content);" >> set-env.js
RUN echo "if (content.includes('apiUrl')) {" >> set-env.js
RUN echo "  content = content.replace(/apiUrl:.*?,/g, `apiUrl: '${newApiUrl}',`);" >> set-env.js
RUN echo "  console.log('Conteúdo atualizado:', content);" >> set-env.js
RUN echo "  fs.writeFileSync(envFile, content);" >> set-env.js
RUN echo "  console.log('Arquivo atualizado com sucesso');" >> set-env.js
RUN echo "} else {" >> set-env.js
RUN echo "  console.log('apiUrl não encontrado no arquivo');" >> set-env.js
RUN echo "}" >> set-env.js

# Executar o script com redireção para ignorar erros
RUN node set-env.js || true

# Construir o app
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar o build da aplicação para o diretório de deploy do nginx
COPY --from=build /app/dist/finance-app /usr/share/nginx/html

# Copiar a configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script para substituir variáveis de ambiente em tempo de execução
WORKDIR /usr/share/nginx/html
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Expor a porta 80
EXPOSE 80

# Usar script personalizado como ponto de entrada
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
