import { openai } from '@ai-sdk/openai';
import { createUIMessageStreamResponse, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default async function POST(request: Request) {
  const { messages } = await request.json();

  // Get the last user message
  const lastUserMessage = messages?.findLast((m: { role: string }) => m.role === 'user');
  if (!lastUserMessage) {
    return new Response(
      JSON.stringify({ error: 'No user message found' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse the question data from the user message content
  let questionData;
  try {
    questionData = JSON.parse(lastUserMessage.content);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid message format' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { question, correctAnswer, userAnswer } = questionData;

  if (!question || !correctAnswer || !userAnswer) {
    return new Response(
      JSON.stringify({ error: 'question, correctAnswer, and userAnswer are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = streamText({
    model: openai('gpt-4o-mini'),
    prompt: `You are an interview coach evaluating a candidate's answer.

Question: ${question}

Correct Answer: ${correctAnswer}

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

  return createUIMessageStreamResponse({ execute: result.toUIMessageStream() });
}
