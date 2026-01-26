#!/bin/bash

echo "🚀 Configurando modelo local para inferência..."

mkdir -p models
cd models

echo ""
echo "📥 Escolha um modelo para baixar:"
echo ""
echo "1. Llama 2 7B Chat (Q4_0) - ~4GB - Recomendado para começar"
echo "2. Llama 2 7B Chat (Q8_0) - ~7GB - Melhor qualidade"
echo "3. Mistral 7B (Q4_0) - ~4GB - Alternativa leve"
echo "4. Phi-2 (Q4_0) - ~1.6GB - Muito leve"
echo ""
read -p "Escolha uma opção (1-4): " choice

case $choice in
  1)
    MODEL_URL="https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_0.gguf"
    MODEL_NAME="llama-2-7b-chat.Q4_0.gguf"
    ;;
  2)
    MODEL_URL="https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q8_0.gguf"
    MODEL_NAME="llama-2-7b-chat.Q8_0.gguf"
    ;;
  3)
    MODEL_URL="https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_0.gguf"
    MODEL_NAME="mistral-7b-instruct-v0.1.Q4_0.gguf"
    ;;
  4)
    MODEL_URL="https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_0.gguf"
    MODEL_NAME="phi-2.Q4_0.gguf"
    ;;
  *)
    echo "❌ Opção inválida"
    exit 1
    ;;
esac

echo ""
echo "📥 Baixando modelo: $MODEL_NAME"
echo "⏳ Isso pode demorar alguns minutos..."
echo ""

if command -v wget &> /dev/null; then
  wget -O "$MODEL_NAME" "$MODEL_URL"
elif command -v curl &> /dev/null; then
  curl -L -o "$MODEL_NAME" "$MODEL_URL"
else
  echo "❌ Erro: wget ou curl não encontrado"
  exit 1
fi

if [ -f "$MODEL_NAME" ]; then
  echo ""
  echo "✅ Modelo baixado com sucesso!"
  echo ""
  echo "📝 Adicione ao seu arquivo .env:"
  echo "LLAMA_MODEL_PATH=./models/$MODEL_NAME"
  echo ""
else
  echo "❌ Erro ao baixar modelo"
  exit 1
fi



