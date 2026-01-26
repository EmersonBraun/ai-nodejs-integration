# AI and ML Integration API

REST API built with NestJS demonstrating AI and Machine Learning integration in Node.js, including practical examples of Google Gemini, LangChain, RAG, local inference, and sentiment analysis.

## Features

- **Google Gemini Integration**: Chat and streaming responses
- **LangChain.js**: Chatbot with conversation history support
- **RAG (Retrieval-Augmented Generation)**: Document ingestion and query with Chroma vector store
- **Local Inference**: Run LLMs locally using GGUF models via node-llama-cpp
- **Sentiment Analysis**: Analyze text sentiment using Transformers.js (local, no API required)
- **OpenAPI Documentation**: Complete Swagger/OpenAPI documentation
- **TypeScript**: Full type safety with class-validator
- **Biome**: Fast linting and formatting

## Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API Key (free with generous limits - get it at https://makersuite.google.com/app/apikey)
- (Optional) GGUF model for local inference

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your API keys
nano .env
```

## Configuration

Create a `.env` file with the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
LLAMA_MODEL_PATH=./models/llama-7b-q4_0.gguf
```

## Running the Application

```bash
# Development mode (with watch)
npm run start:dev

# Build for production
npm run build

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

After starting the server, access the interactive documentation at:
- **Swagger UI**: http://localhost:3000/docs

## Main Endpoints

### Gemini
- `POST /api/gemini/chat` - Simple chat with Google Gemini
- `POST /api/gemini/stream` - Chat with streaming responses

### LangChain
- `POST /api/chatbot` - Chatbot with LangChain.js

### RAG (Retrieval-Augmented Generation)
- `POST /api/rag/ingest` - Ingest documents into vector store
- `POST /api/rag/query` - Query with RAG

### Local Inference
- `POST /api/local-inference` - Inference with local models (node-llama-cpp - optional, requires separate installation)
- `GET /api/local-inference/status` - Check local inference status

### Sentiment Analysis
- `POST /api/sentiment` - Sentiment analysis with Transformers.js
- `POST /api/sentiment/batch` - Batch sentiment analysis

### Health
- `GET /api/health` - Health check endpoint

## Local Models Setup

To use local inference, follow these steps:

### 1. Check Status
```bash
curl http://localhost:3000/api/local-inference/status
```

### 2. Install node-llama-cpp (if needed)
```bash
npm install node-llama-cpp
```

### 3. Download a GGUF Model

**Option A: Automated script**
```bash
chmod +x setup-local-model.sh
./setup-local-model.sh
```

**Option B: Manual**
```bash
# Create directory
mkdir -p models
cd models

# Download model (example: Llama 2 7B Q4_0 - ~4GB)
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_0.gguf

# Or use curl
curl -L -o llama-2-7b-chat.Q4_0.gguf https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_0.gguf
```

### 4. Configure in .env
Add to your `.env` file:
```
LLAMA_MODEL_PATH=./models/llama-2-7b-chat.Q4_0.gguf
```

### 5. Verify Again
```bash
curl http://localhost:3000/api/local-inference/status
```

Now `available` and `nodeLlamaCppInstalled` should be `true`.

### Recommended Models

- **Llama 2 7B Q4_0** (~4GB) - Good balance of quality/size
- **Mistral 7B Q4_0** (~4GB) - Modern alternative
- **Phi-2 Q4_0** (~1.6GB) - Very lightweight, ideal for testing
- **Llama 2 7B Q8_0** (~7GB) - Better quality, requires more RAM

Find more models at: https://huggingface.co/models?search=gguf

## Technology Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Static typing
- **class-validator** - Validation decorators
- **@nestjs/swagger** - Automatic OpenAPI documentation
- **Google Gemini API** - Integration with Gemini models (free)
- **LangChain.js** - Framework for chains and agents
- **Transformers.js** - ML models in JavaScript
- **Chroma** - Local vector store
- **node-llama-cpp** - Local LLM inference
- **Biome** - Fast linting and formatting

## Development

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
src/
├── main.ts                    # Application bootstrap
├── app.module.ts              # Root module
├── app.controller.ts          # Health check controller
├── config/                    # Configuration module
├── gemini/                    # Gemini feature module
├── chatbot/                   # LangChain chatbot module
├── rag/                       # RAG feature module
├── local-inference/           # Local inference module
└── sentiment/                 # Sentiment analysis module
```

## Examples

See the Swagger documentation at `/docs` for interactive examples of each endpoint.

## Author

**Emerson Braun**
- Regional Director at Plan A Technologies
- LinkedIn: [linkedin.com/in/emerson-braun](https://linkedin.com/in/emerson-braun)

## License

MIT
