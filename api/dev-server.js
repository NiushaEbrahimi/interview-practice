// Local dev server for AI scoring endpoint
// Run: node api/dev-server.js

import express from 'express';
import cors from 'cors';
import { openai } from '@ai-sdk/openai';
import { streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/score', async (req, res) => {
  const { messages } = req.body;

  // Get the last user message
  const lastUserMessage = messages?.findLast(m => m.role === 'user');
  if (!lastUserMessage) {
    return res.status(400).json({ error: 'No user message found' });
  }

  // Parse the question data from the user message content
  let questionData;
  try {
    questionData = JSON.parse(lastUserMessage.content);
  } catch {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  const { question, userAnswer } = questionData;

  if (!question || !userAnswer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    prompt: `You are an interview coach evaluating a candidate's answer.

Question: ${question}

Candidate's Answer: ${userAnswer}

Rate the candidate's answer on a scale of 1-5:
1 = Completely wrong or irrelevant
2 = Partially correct but major gaps
3 = Mostly correct with some gaps
4 = Correct with minor details missing
5 = Excellent, comprehensive answer

Respond in this exact JSON format only, no other text:
{"score": <1-5>, "feedback": "<brief 1-2 sentence explanation>"}`,
  });

  // Create UI message stream response for useChat compatibility
  const stream = createUIMessageStream({
    execute: result.toUIMessageStream(),
  });

  // Pipe the stream to the response
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
  } catch (error) {
    console.error('Stream error:', error);
  } finally {
    res.end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AI scoring server running on http://localhost:${PORT}`);
});
