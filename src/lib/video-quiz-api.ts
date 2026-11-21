/** Public view models for the API-driven video/quiz system. */
import type {
  DiscussionRow,
  QuizAttemptRow,
  QuizQuestionRow,
  QuizRow,
  VideoRow,
} from "@/lib/db/schema";
import { youtubeEmbedUrl } from "@/lib/youtube";

export type SaveResult = { ok: boolean; message: string };

export type VideoView = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  host: string;
  episode: number;
  duration: string;
  views: string;
  thumbnail: string;
  source: "youtube" | "upload";
  youtubeId: string | null;
  embedUrl: string | null;
  videoUrl: string | null;
  featured: boolean;
  status: string;
  publishedAt: string | null;
  createdAt: string;
};

export type QuizQuestionView = {
  id: string;
  position: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  marks: number;
};

export type QuizView = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  instructions: string;
  type: "book" | "watch" | "general";
  videoId: string | null;
  videoSlug: string | null;
  durationMinutes: number;
  featured: boolean;
  status: string;
  questions: QuizQuestionView[];
  questionCount: number;
  totalMarks: number;
  createdAt: string;
};

export type DiscussionView = {
  id: string;
  target: "video" | "quiz";
  targetId: string;
  userId: string | null;
  userName: string;
  userImage: string | null;
  body: string;
  parentId: string | null;
  isAdmin: boolean;
  status: string;
  likes: number;
  likedByMe: boolean;
  createdAt: string;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  city: string | null;
  score: number;
  totalMarks: number;
  percentage: number;
  attempts: number;
  quizzesPlayed: number;
  bestQuizTitle: string | null;
};

export type AttemptView = {
  id: string;
  quizId: string;
  quizTitle: string;
  quizSlug: string;
  score: number;
  totalMarks: number;
  percentage: number;
  seconds: number;
  createdAt: string;
};

const iso = (value: Date | null): string | null => (value ? value.toISOString() : null);

export function toVideoView(row: VideoRow): VideoView {
  const youtubeId = row.source === "youtube" ? row.youtubeId : null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    host: row.host,
    episode: row.episode,
    duration: row.duration,
    views: row.views,
    thumbnail: row.thumbnail,
    source: row.source === "upload" ? "upload" : "youtube",
    youtubeId,
    embedUrl: youtubeId ? youtubeEmbedUrl(youtubeId) : null,
    videoUrl: row.source === "upload" ? row.videoUrl : null,
    featured: row.featured,
    status: row.status,
    publishedAt: iso(row.publishedAt),
    createdAt: row.createdAt.toISOString(),
  };
}

export function toQuizView(
  row: QuizRow,
  questions: QuizQuestionRow[],
  videoSlug: string | null = null,
): QuizView {
  const ordered = [...questions].sort((a, b) => a.position - b.position).map(toQuestionView);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    instructions: row.instructions,
    type: row.type === "watch" || row.type === "general" ? row.type : "book",
    videoId: row.videoId,
    videoSlug,
    durationMinutes: row.durationMinutes,
    featured: row.featured,
    status: row.status,
    questions: ordered,
    questionCount: ordered.length,
    totalMarks: ordered.reduce((sum, question) => sum + question.marks, 0),
    createdAt: row.createdAt.toISOString(),
  };
}

export function toQuestionView(row: QuizQuestionRow): QuizQuestionView {
  return {
    id: row.id,
    position: row.position,
    question: row.question,
    options: row.options,
    answerIndex: row.answerIndex,
    explanation: row.explanation,
    marks: row.marks,
  };
}

export function toDiscussionView(
  row: DiscussionRow,
  likedByMe = false,
): DiscussionView {
  return {
    id: row.id,
    target: row.target === "quiz" ? "quiz" : "video",
    targetId: row.targetId,
    userId: row.userId,
    userName: row.userName,
    userImage: row.userImage,
    body: row.body,
    parentId: row.parentId,
    isAdmin: row.isAdmin,
    status: row.status,
    likes: row.likes,
    likedByMe,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toAttemptView(
  row: QuizAttemptRow,
  quizTitle: string,
  quizSlug: string,
): AttemptView {
  return {
    id: row.id,
    quizId: row.quizId,
    quizTitle,
    quizSlug,
    score: row.score,
    totalMarks: row.totalMarks,
    percentage: row.percentage,
    seconds: row.seconds,
    createdAt: row.createdAt.toISOString(),
  };
}
