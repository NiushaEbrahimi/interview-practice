import { useEffect, useState } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useParams } from "react-router-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AI_API_URL } from "../../config";

interface AIScoreResult {
    score: number;
    feedback: string;
}

export default function Question({ id, question, answer }: { id: number; question: string; answer: string }) {
    const paramsURL = useParams();
    const authFetch = useAuthFetch();

    const [score, setScore] = useState<number | null>(null);
    const [answerDisplay, setAnswerDisplay] = useState(false);
    const [comeBack, setComeBack] = useState(false);

    // AI Scoring state
    const [userAnswer, setUserAnswer] = useState("");
    const [aiResult, setAiResult] = useState<AIScoreResult | null>(null);

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: AI_API_URL,
        }),
        onError: (error) => {
            console.error("AI scoring error:", error);
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authFetch(
                    `http://127.0.0.1:8000/api/attempts/?lesson=${paramsURL.lesson}&question=${id}`
                );

                const last = response?.[0];
                setScore(last?.confidence_rate ?? null);
                setComeBack(last?.come_back_again ?? false);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [authFetch, id, paramsURL.lesson]);

    const handleRate = async (value: number) => {
        setScore(value);
        try {
            await authFetch("http://127.0.0.1:8000/api/attempts/", {
                method: "POST",
                body: JSON.stringify({
                    question: id,
                    confidence_rate: value,
                    come_back_again: comeBack,
                }),
            });
        } catch (err) {
            console.log(`The error is ${err}`);
        }
    };

    // Parse AI response when messages change
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "assistant") {
                // Get text content from parts
                const textParts = lastMessage.parts?.filter(
                    (part): part is { type: "text"; text: string } => part.type === "text"
                );
                const content = textParts?.map((p) => p.text).join("") || "";

                if (content) {
                    try {
                        const jsonMatch = content.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            const parsed = JSON.parse(jsonMatch[0]);
                            // eslint-disable-next-line react-hooks/set-state-in-effect
                            setAiResult(parsed);
                            handleRate(parsed.score);
                        }
                    } catch (err) {
                        console.error("Failed to parse AI response:", err);
                    }
                }
            }
        }
    }, [messages]);

    const handleComeBack = async (checked: boolean) => {
        setComeBack(checked);
        try {
            await authFetch("http://127.0.0.1:8000/api/attempts/", {
                method: "POST",
                body: JSON.stringify({
                    question: id,
                    confidence_rate: score || 3,
                    come_back_again: checked,
                }),
            });
        } catch (err) {
            console.log(`The error is ${err}`);
        }
    };

    const handleAIScore = async () => {
        // TODO: should handle the edge cases of input, entering emojies or wrong lang 
        if (!userAnswer.trim()) return;

        setAiResult(null);

        await sendMessage({
            text: JSON.stringify({
                question,
                correctAnswer: answer,
                userAnswer,
            }),
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 4) return "text-green-600";
        if (score >= 3) return "text-yellow-600";
        return "text-red-600";
    };

    // Get streaming text from last assistant message
    const getStreamedText = () => {
        if (messages.length === 0) return "";
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role !== "assistant") return "";
        const textParts = lastMessage.parts?.filter(
            (part): part is { type: "text"; text: string } => part.type === "text"
        );
        return textParts?.map((p) => p.text).join("") || "";
    };

    const isStreaming = status === "streaming" || status === "submitted";

    return (
        <section className="bg-white px-20 p-6 rounded-lg shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h6 className="font-medium text-lg">Question:</h6>
                <p>{question}</p>
            </div>

            {/* AI Scoring Section */}
            <div className="border-t pt-4">
                <h6 className="font-medium text-lg mb-2">Your Answer:</h6>
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={4}
                />
                <button
                    onClick={handleAIScore}
                    disabled={isStreaming || !userAnswer.trim()}
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isStreaming ? "Scoring..." : "Get AI Score"}
                </button>

                {/* Streaming text display */}
                {isStreaming && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-sm italic">AI is thinking...</p>
                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{getStreamedText()}</p>
                    </div>
                )}

                {/* Final result */}
                {aiResult && !isStreaming && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">AI Score:</span>
                            <span className={`text-2xl font-bold ${getScoreColor(aiResult.score)}`}>
                                {aiResult.score}/5
                            </span>
                        </div>
                        <p className="mt-2 text-gray-700">{aiResult.feedback}</p>
                    </div>
                )}
            </div>

            <div>
                <h6 className="font-medium text-lg">Answer:</h6>
                <p className={answerDisplay ? "m-4" : " m-4 hidden"}>{answer}</p>
                <button
                    className="rounded shadow p-2 mt-4"
                    style={{ backgroundColor: "#00bfff", color: "white" }}
                    onClick={() => setAnswerDisplay(!answerDisplay)}
                >
                    {answerDisplay ? "Hide Answer" : "Reveal Answer"}
                </button>
            </div>
            <div className="flex flex-col gap-3">
                <p>How close was your answer?</p>

                <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value} className="flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name={`answerScore-${id}`}
                                value={value}
                                checked={score === value}
                                onChange={() => handleRate(value)}
                            />
                            {value}
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex">
                <div className="border-gray-400 border-1-css rounded-md p-2 shadow">
                    <label className="flex items-center text-sm">
                        <input
                            type="checkbox"
                            name={`comeBack-${id}`}
                            className="mr-2 mt-1"
                            checked={comeBack}
                            onChange={(e) => handleComeBack(e.target.checked)}
                        />
                        come back again
                    </label>
                </div>
            </div>
        </section>
    );
}
