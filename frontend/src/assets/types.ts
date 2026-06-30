export type UserProfile = {
    created_at: string;
    email: string;
    id: number;
    is_active: boolean;
    is_verified: boolean;
    profile: {
        experience_level: "junior" | 'beginner' | 'mid-level' | 'senior';
        full_name: string;
        known_technologies: string;
        learning_technologies: string;
        known_technologies_list: string[];
        learning_technologies_list: string[];
    }
}

export type Course = {
  label: string;
  courseName: string;
  level: "Easy" | "Medium" | "Hard";
  percent: number;
};

export type paramsURLType = {
    label : string,
    level? : string,
    lesson: string,
}

export type LessonType = {
  id: number;
  name: string;
  course: string;
  level: number;
  level_display: string;
  questions_count: number;
  questions_answered: number;
  started : boolean,
}

export type StudyLater = {
    id : number,
    question : string,
}

export type StudyLaterLesson = {
    id: number;
    name: string;
    level: number;
    level_display: string;
    course: string;
    progress_percent: number;
}

export type ComeBackQuestion = {
    id: number;
    question: string;
    correct_answer: string;
    lesson: string;
    level_display: string;
    course: string;
}

export type LevelStatsType = {
  level: number;
  level_display: "Easy" | "Medium" | "Hard";
  answered: number;
  total: number;
  percent: number;
};

export type TopicStatsType = {
  topic: string;
  answered: number;
  total: number;
  percent: number;
};

export type StatsType = {
  questions_practiced: number;
  accuracy_rate: number;
  days_streak: number;
  courses: number;
  levels: LevelStatsType[];
  topics: TopicStatsType[];
  study_later_lessons: StudyLaterLesson[];
  come_back_questions: ComeBackQuestion[];
};

export type QuestionType = {
    id: number,
    question: string,
    correct_answer: string,
    lesson: number
}

export type CourseType = {
  id: number;
  lessons: Array<LessonType>;
  title: string;
  started: boolean;
}

export type responseType = {
    answered_at: string;
    come_back_again: boolean;
    confidence_rate: number;
    id: number;
    question: number;
    user : number;
}

