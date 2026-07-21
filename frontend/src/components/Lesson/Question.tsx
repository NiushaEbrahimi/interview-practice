import { useEffect, useState } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useParams } from "react-router-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AI_API_URL } from "../../config";

interface AIScoreResult {
    score: number;
    feedback: string;
    answer: string;
}

export default function Question({ id, question }: { id: number; question: string; }) {
    const paramsURL = useParams();
    const authFetch = useAuthFetch();

    const [score, setScore] = useState<number | null>(null);
    const [comeBack, setComeBack] = useState(false);

    // AI Scoring state
    const [userAnswer, setUserAnswer] = useState("");
    const [aiResult, setAiResult] = useState<AIScoreResult | null>(null);

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: AI_API_URL,
            headers: () => ({
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }),
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
        if (!userAnswer.trim()) return;

        setAiResult(null);

        await sendMessage({
            text: JSON.stringify({
                question,
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
        const final = textParts?.map((p) => p.text).join("") || "";
        const cutFrom = (final.indexOf("\"feedback\": \""))+("\"feedback\": \"".length)
        const cutTill = (final.indexOf(`"answer": "`))
        return final.slice(cutFrom,cutTill-3)
    };

    const isStreaming = status === "streaming" || status === "submitted";

    return (
        <section className="bg-white dark:bg-gray-800 px-6 sm:px-12 lg:px-20 p-4 sm:p-6 rounded-lg shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h6 className="font-medium text-lg text-gray-900 dark:text-gray-100">Question:</h6>
                <p className="text-gray-800 dark:text-gray-200">{question}</p>
            </div>

            {/* AI Scoring Section */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h6 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">Your Answer:</h6>
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">AI is thinking...</p>
                        <p className="mt-2 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{getStreamedText()}</p>
                    </div>
                )}

                {/* Final result */}
                {aiResult && !isStreaming && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">AI Score:</span>
                            <span className={`text-2xl font-bold ${getScoreColor(aiResult.score)}`}>
                                {aiResult.score}/5
                            </span>
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-gray-200">{aiResult.feedback}</p>
                        <div className="mt-3 border-t border-gray-200 dark:border-gray-600 pt-3">
                            <span className="font-medium text-gray-900 dark:text-gray-100">Suggested Answer:</span>
                            <p className="mt-1 text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{aiResult.answer}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex">
                <div className="border-gray-400 dark:border-gray-500 border-1-css rounded-md p-2 shadow">
                    <label className="flex items-center text-sm text-gray-800 dark:text-gray-200">
                        <input
                            type="checkbox"
                            name={`comeBack-${id}`}
                            className="mr-2 mt-1"
                            style={{ colorScheme: "light dark" }}
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
