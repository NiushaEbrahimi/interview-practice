import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import type { StatsType } from "../assets/types";
import { useNavigate } from "react-router-dom";

type LessonProgressType = {
  id: number;
  lesson: number;
  lesson_name: string;
  lesson_level_display: "Easy" | "Medium" | "Hard";
  course_title: string;
  progress_percent: number;
  will_study_later: boolean;
};

const LEVELS = ["Easy", "Medium", "Hard"] as const;

export default function Progress() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const authFetch = useAuthFetch();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [progressItems, setProgressItems] = useState<LessonProgressType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, progressResponse] = await Promise.all([
          authFetch("http://127.0.0.1:8000/api/stats/me/"),
          authFetch("http://127.0.0.1:8000/api/progress/"),
        ]);

        setStats(statsResponse);
        setProgressItems(Array.isArray(progressResponse) ? progressResponse : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load progress data. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressByLevel = useMemo(() => {
    if (stats?.levels?.length) {
      return stats.levels.map((item) => ({
        level: item.level_display,
        percent: item.percent,
      }));
    }

    return LEVELS.map((level) => {
      const itemsAtLevel = progressItems.filter(
        (item) => item.lesson_level_display === level
      );
      const percent = itemsAtLevel.length
        ? Math.round(
            itemsAtLevel.reduce((sum, item) => sum + item.progress_percent, 0) /
              itemsAtLevel.length
          )
        : 0;

      return { level, percent };
    });
  }, [progressItems, stats]);

  const progressByTopic = useMemo(() => {
    if (stats?.topics?.length) {
      return stats.topics.slice(0, 3).map((item) => ({
        topic: item.topic,
        percent: item.percent,
      }));
    }

    const topicMap = progressItems.reduce<Record<string, { total: number; count: number }>>(
      (acc, item) => {
        const topic = item.course_title || item.lesson_name || "Uncategorized";
        if (!acc[topic]) {
          acc[topic] = { total: 0, count: 0 };
        }
        acc[topic].total += item.progress_percent;
        acc[topic].count += 1;
        return acc;
      },
      {}
    );

    return Object.entries(topicMap)
      .map(([topic, stats]) => ({
        topic,
        percent: Math.min(Math.round(stats.total / stats.count), 100),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);
  }, [progressItems, stats]);

  const needsReview = useMemo(
    () =>
      progressItems
        .filter((item) => item.progress_percent < 60)
        .sort((a, b) => a.progress_percent - b.progress_percent)
        .slice(0, 3),
    [progressItems]
  );
  console.log(stats)

  return (
    <div className="min-h-screen bg-gray-100 flex py-6 px-15 ">      
    
          <div className="flex-1 flex flex-col bg-gray-200 rounded-2xl overflow-hidden">
    
          <Header username={user?.profile.full_name || "User"} />

          <main className=" py-6 px-10 space-y-6 grid gap-6 xl:grid-cols-[1.4fr_1fr] xl:items-start">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h1 className="text-gray-700 text-2xl font-semibold mb-4">Progress overview</h1>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Questions practiced</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats?.questions_practiced ?? "–"}
                  </p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Average confidence</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {Math.round((stats?.accuracy_rate ?? 0)/5) * 100}%
                  </p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Days streak</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats?.days_streak ?? "–"}
                  </p>
                </div>
                <div className="rounded-3xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Courses practiced</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats?.courses ?? "–"}
                  </p>
                </div>
              </div>

              {error ? (
                <p className="mt-6 text-sm text-red-600">{error}</p>
              ) 
              // TODO: add skeleton
              : isLoading ? (
                <p className="mt-6 text-sm text-gray-600">Loading progress data…</p>
              ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-3xl bg-gray-50 p-5">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Progress by Level</h2>
                    <div className="space-y-4">
                      {progressByLevel.map((level) => (
                        <div key={level.level} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{level.level}</span>
                            <span>{level.percent}%</span>
                          </div>
                          <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-300">
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                              style={{ width: `${Math.min(Math.max(level.percent, 0), 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-gray-50 p-5">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Progress by Topic</h2>
                    <div className="space-y-4">
                      {progressByTopic.length ? (
                        progressByTopic.map((topic) => (
                          <div key={topic.topic} className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{topic.topic}</span>
                              <span>{topic.percent}%</span>
                            </div>
                            <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-300">
                              <div
                                className="absolute left-0 top-0 h-full rounded-full bg-blue-400 transition-all duration-300"
                                style={{ width: `${Math.min(Math.max(topic.percent, 0), 100)}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">No topic progress available yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-gray-700 text-2xl font-semibold">Needs Review</h2>
                  <p className="text-sm text-gray-500">Lessons with lower progress percent</p>
                </div>
                <div className="space-y-4">
                  {needsReview.length ? (
                    needsReview.map((item) => (
                      <div key={item.id} className="rounded-3xl bg-gray-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{item.lesson_name}</p>
                            <p className="text-sm text-gray-500">
                              {item.course_title} · {item.lesson_level_display}
                            </p>
                          </div>
                          <button
                            onClick={()=>navigate(`/courses/${item.course_title}/${item.lesson_level_display}/${item.lesson_name}`)}
                            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                          >
                            Resume
                          </button>
                        </div>
                        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-300">
                          <div
                            className="h-full rounded-full bg-blue-400"
                            style={{ width: `${Math.min(Math.max(item.progress_percent, 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No items need review yet. Keep practicing to build progress data.</p>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
  );
}
