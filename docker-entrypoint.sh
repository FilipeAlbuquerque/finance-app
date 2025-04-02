#!/bin/sh
set -e

# Mostrar informações para debug
echo "Diretório atual: $(pwd)"
echo "Listando arquivos JavaScript:"
find /usr/share/nginx/html -name "*.js" | sort

# Definir valor padrão para API_URL se não estiver definido
API_URL=${API_URL:-http://localhost:8080/api/v1}
echo "Configurando API URL: $API_URL"

# Procurar arquivos JavaScript principais e substituir URLs
JS_FILES=$(find /usr/share/nginx/html -name "main*.js" 2>/dev/null || echo "")
if [ -n "$JS_FILES" ]; then
    for file in $JS_FILES; do
        echo "Modificando arquivo: $file"
        # Substituir qualquer URL de API que encontrar
        sed -i "s|\"\/api\"|\"$API_URL\"|g" $file
        sed -i "s|\"\/api\/v1\"|\"$API_URL\"|g" $file
        echo "Arquivo modificado com sucesso"
    done
else
    echo "Aviso: Nenhum arquivo main*.js encontrado!"
    # Tentar encontrar outros arquivos que possam conter a URL da API
    JS_FILES=$(find /usr/share/nginx/html -name "*.js" 2>/dev/null || echo "")
    if [ -n "$JS_FILES" ]; then
        echo "Tentando outros arquivos JavaScript..."
        for file in $JS_FILES; do
            if grep -q "\/api" $file; then
                echo "Encontrada referência à API em: $file"
                sed -i "s|\"\/api\"|\"$API_URL\"|g" $file
                sed -i "s|\"\/api\/v1\"|\"$API_URL\"|g" $file
            fi
        done
    fi
fi

echo "Configuração concluída. Iniciando Nginx..."

# Iniciar o nginx
exec "$@"
