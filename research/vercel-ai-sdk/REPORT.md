# Vercel AI SDK — Complete Guide for React (Vite) + Django Projects

## 1. What Is the Vercel AI SDK?

The Vercel AI SDK (currently at **v7**) is a free, open-source TypeScript toolkit for building AI-powered applications. It provides a **provider-agnostic** abstraction layer so you can swap between AI providers (OpenAI, Anthropic, Google, etc.) by changing a single line of code.

**Key stats:**
- 25.6k GitHub stars, 4.8k forks
- 100k+ dependent projects
- 22,000+ releases (rapid release cadence)
- Created by the Vercel/Next.js team

**Core philosophy:** Standardize how you interact with LLMs so you focus on building features, not wiring provider-specific APIs.

---

## 2. Architecture — The Three Surfaces

The SDK is split into three independent packages:

### AI SDK Core (`ai`)
The foundation. Provides:
- `generateText()` — one-shot text generation
- `streamText()` — streaming text generation
- `generateObject()` — structured data generation (JSON with Zod schemas)
- Tool calling / function calling
- Agent capabilities (`ToolLoopAgent`)
- MCP (Model Context Protocol) support
- Embeddings, reranking, image generation, transcription, speech

### AI SDK UI (`@ai-sdk/react`)
Framework-agnostic React hooks for building chat UIs:
- `useChat` — full chatbot with streaming, state management, error handling
- `useCompletion` — text completion interfaces
- `useObject` — streaming structured object generation
- Custom transport layer (you control where requests go)

### AI SDK RSC (React Server Components)
Next.js-specific. **Not relevant for your Vite setup** — skip this entirely.

---

## 3. Supported Providers (30+)

**First-party packages (`@ai-sdk/*`):**
OpenAI, Anthropic, Google (Gemini), xAI (Grok), Azure, Amazon Bedrock, Mistral, Groq, DeepSeek, Together.ai, Cohere, Fireworks, DeepInfra, Google Vertex, Cerebras, Perplexity, ElevenLabs, LMNT, Deepgram, and more.

**Community providers:**
Ollama, OpenRouter, Cloudflare Workers AI, LM Studio, and 20+ others.

**Vercel AI Gateway:** A managed proxy that gives you access to all major providers with a single API key. You can use model strings like `"openai/gpt-5.4"` or `"anthropic/claude-opus-4.6"` directly.

**Quick provider swap example:**
```ts
// Switch providers by changing one line:
import { openai } from '@ai-sdk/openai';
// import { anthropic } from '@ai-sdk/anthropic';
// import { google } from '@ai-sdk/google';

const result = await generateText({
  model: openai('gpt-5.4'),  // or anthropic('claude-opus-4-6')
  prompt: 'Hello!',
});
```

---

## 4. Tool Calling / Function Calling

Tools let LLMs call your functions. Define them with Zod schemas:

```ts
import { tool } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: 'openai/gpt-5.4',
  tools: {
    getWeather: tool({
      description: 'Get weather for a location',
      inputSchema: z.object({
        location: z.string(),
      }),
      execute: async ({ location }) => {
        // Call your real API here
        return { temp: 72, condition: 'sunny' };
      },
    }),
  },
  stopWhen: isStepCount(5),  // allow multi-step tool chains
});
```

The LLM decides when to call tools, the SDK executes them, and feeds results back automatically. Multi-step tool chains are supported via `stopWhen`.

---

## 5. Frontend: The `useChat` Hook

This is the main hook for building chat UIs. It works in **any React app** (not just Next.js):

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

function Chat() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:8000/api/chat/',  // Your Django endpoint
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  });
  const [input, setInput] = useState('');

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.parts.map((part, i) =>
            part.type === 'text' ? <span key={i}>{part.text}</span> : null
          )}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </div>
  );
}
```

**Key features:**
- **Status tracking**: `submitted` | `streaming` | `ready` | `error`
- **Stop/regenerate**: `stop()` to abort, `regenerate()` to retry
- **Custom headers/body**: Pass auth tokens, user IDs, etc.
- **File attachments**: Send images/files with messages
- **Message metadata**: Track token usage, timestamps
- **Throttling**: Control UI re-render frequency
- **Error handling**: Built-in error states with retry

---

## 6. Backend Integration (This Is the Critical Part for You)

### The Problem
The AI SDK's backend examples are all Next.js Route Handlers. **You're using Django.** Here's how to make it work.

### Option A: Use a Node.js BFF (Backend-for-Frontend)
Add a small Express/Hono server that wraps the AI SDK:

```ts
// chat-server.ts
import { streamText, createUIMessageStreamResponse, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const result = streamText({
    model: openai('gpt-5.4'),
    messages: convertToModelMessages(messages),
  });
  return createUIMessageStreamResponse({ stream: result.toUIMessageStream() });
});

app.listen(3001);
```

Then point your `useChat` transport to `http://localhost:3001/api/chat`.

### Option B: Have Django Stream SSE/Chunked Responses
Your Django view can call the AI provider directly (OpenAI/Anthropic SDKs for Python) and stream back in the format the `useChat` hook expects. The SDK's `TextStreamChatTransport` can consume plain text streams:

```tsx
const { messages } = useChat({
  transport: new TextStreamChatTransport({
    api: 'http://localhost:8000/api/chat/',  // Django endpoint
  }),
});
```

Your Django view would stream plain text chunks (SSE or newline-delimited).

### Option C: Use Vercel AI Gateway (No Backend Changes)
If you use the Vercel AI Gateway, the frontend can call the gateway directly (it handles auth/routing). Your Django backend doesn't need to be involved in AI calls at all.

### What About Python/Django?
There is **no official Python SDK** for Vercel AI SDK. The `ai-python` GitHub repo doesn't exist. The SDK is TypeScript-only. However, you can:
1. Use Python's `openai` / `anthropic` libraries directly in Django and stream responses back
2. Build a small Node.js sidecar for the AI SDK integration
3. Use the gateway approach where the frontend talks directly to the AI provider

---

## 7. Streaming Protocol

The SDK uses a custom streaming protocol (not plain SSE). Key functions:

**Server-side (Node.js):**
```ts
import { streamText, createUIMessageStreamResponse, toUIMessageStream } from 'ai';

const result = streamText({ model, messages });
return createUIMessageStreamResponse({
  stream: toUIMessageStream({ stream: result.stream }),
});
```

**For plain text streaming** (works with any backend including Django):
```tsx
import { TextStreamChatTransport } from 'ai';

useChat({
  transport: new TextStreamChatTransport({ api: 'http://localhost:8000/api/chat/' }),
});
```

---

## 8. How It Works in Your Vite+Django Setup

### Recommended Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  React (Vite)       │────▶│  Django REST Backend  │────▶│  AI Provider│
│  @ai-sdk/react      │ SSE │  /api/chat/           │ API │  OpenAI/etc │
│  useChat hook       │◀────│  Streams text chunks  │◀────│  Streaming  │
└─────────────────────┘     └──────────────────────┘     └─────────────┘
```

**Steps:**
1. `npm install ai @ai-sdk/react @ai-sdk/openai` (or whichever provider)
2. In your React component, use `useChat` with `TextStreamChatTransport` pointing to your Django endpoint
3. In Django, create a view that calls the AI provider and streams back text chunks
4. The `useChat` hook handles all state management, streaming, and UI updates

### Why This Works
- `TextStreamChatTransport` expects plain text streams — any backend can produce these
- No need for the AI SDK's Node.js server-side packages in production
- You keep your Django backend as the single API layer
- Auth can be passed via custom headers on the transport

---

## 9. Limitations & Gotchas

1. **No Python SDK** — The AI SDK is TypeScript-only. If you want to use its tool calling/agent features server-side, you need Node.js.

2. **Stream protocol mismatch** — The full `useChat` experience (tool calls, metadata, reasoning tokens) requires the AI SDK's stream protocol. Plain text streaming loses these features.

3. **Next.js bias** — Many examples and templates assume Next.js. You'll need to adapt patterns for Vite+Django.

4. **AI Gateway is Vercel-hosted** — Using the gateway means your AI calls go through Vercel's infrastructure. If you want direct provider calls, install the specific provider package.

5. **v7 is recent** — Breaking changes from v4/v5/v6. Make sure docs match your version.

6. **Bundle size** — The `ai` package is ~50-100KB. Tree-shaking helps but it's not tiny.

---

## 10. Comparison with Alternatives

| Feature | Vercel AI SDK | Direct API Calls | LangChain.js |
|---------|--------------|-----------------|-------------|
| Provider abstraction | Excellent (30+ providers) | None (manual) | Good |
| Streaming UI hooks | Built-in (`useChat`) | Manual SSE handling | Manual |
| Tool calling | Built-in with Zod | Manual | Built-in |
| TypeScript types | Excellent | Varies | Good |
| Python support | None | Full | Full |
| Bundle size | ~50-100KB | 0 (raw fetch) | ~200KB+ |
| Django compatibility | Frontend only | Full | Backend only |
| Learning curve | Low-Medium | Low | Medium-High |

**For your stack:** The AI SDK shines on the **frontend** (React hooks, streaming UI). On the **backend** (Django), you'd use Python's native AI libraries directly. The SDK's value is primarily in the React layer.

---

## 11. Quick Start for Your Project

```bash
# In frontend/
npm install ai @ai-sdk/react @ai-sdk/openai
```

```tsx
// src/components/Chat.tsx
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';

export default function Chat() {
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({
      api: 'http://127.0.0.1:8000/api/chat/',
      headers: () => ({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      }),
    }),
  });
  // ... render messages and input form
}
```

```python
# backend/api/views.py
from django.http import StreamingHttpResponse
import openai

def chat_view(request):
    messages = request.json()['messages']
    client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    def stream():
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": m["role"], "content": m["content"]} for m in messages],
            stream=True,
        )
        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    return StreamingHttpResponse(stream(), content_type='text/plain')
```

---

**Sources:**
- https://sdk.vercel.ai/docs/introduction
- https://sdk.vercel.ai/docs/getting-started/nodejs
- https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot
- https://sdk.vercel.ai/docs/ai-sdk-core/generating-text
- https://sdk.vercel.ai/docs/foundations/providers-and-models
- https://github.com/vercel/ai
