/** Editable video, quiz and discussion content for the Watch & Quiz surfaces. */

import { quizQuestions, videos } from "@/data/community";
import { demoComments } from "@/data/comment-demo";
import { sectionDefaults } from "@/lib/section-content";
import type { QuizQuestion, TalkVideo } from "@/lib/types";

export interface VideoQuizQuestion extends QuizQuestion {
  id: string;
  /** Which video this question belongs to (empty = general/book quiz). */
  videoId: string;
}

export interface VideoComment {
  id: string;
  userId: string;
  userName: string;
  target: "video" | "quiz";
  videoId?: string;
  text: string;
  time: string;
  likes: number;
  parentId?: string;
}

export interface VideoQuizContent {
  section: { eyebrow: string; title: string; description: string; linkLabel: string };
  home: {
    title: string;
    description: string;
    progressPrefix: string;
    progressSuffix: string;
    quizTitle: string;
    quizText: string;
    quizNote: string;
    allWatchedNote: string;
    watchedSoFarNote: string;
    demoNote: string;
  };
  videoPage: {
    eyebrow: string;
    title: string;
    description: string;
    pills: string[];
    promoEyebrow: string;
    promoTitle: string;
    promoText: string;
  };
  quizPage: {
    eyebrow: string;
    title: string;
    description: string;
    pills: string[];
  };
  videos: TalkVideo[];
  quizzes: VideoQuizQuestion[];
  comments: VideoComment[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const VIDEO_QUIZ_STORAGE_KEY = "talknestbd-video-quiz-v1";

const section = sectionDefaults["video-quiz"];

function toQuestion(question: QuizQuestion, index: number): VideoQuizQuestion {
  return { ...question, id: `q${index + 1}`, videoId: "" };
}

export const videoQuizDefaults: VideoQuizContent = {
  section: {
    eyebrow: section?.eyebrow ?? "Watch & learn",
    title: section?.title ?? "Videos and quizzes for curious readers",
    description: section?.description ?? "",
    linkLabel: section?.linkLabel ?? "Explore videos",
  },
  home: {
    title: "Many videos. One quiz waiting below.",
    description:
      "Pick an episode from the shelf, watch it without leaving the page, then scroll down to the quiz. Six conversations, six questions — a tea-break challenge for readers.",
    progressPrefix: "of",
    progressSuffix: "episodes watched",
    quizTitle: "The quiz below the videos",
    quizText: "Now that you have watched, how much stuck?",
    quizNote:
      "Six quick questions on the episodes and the books behind them. Answers come with a short explanation.",
    allWatchedNote: "Shelf complete — you have watched every episode.",
    watchedSoFarNote: "episodes watched so far",
    demoNote: "Demo videos play from YouTube. Watching is tracked only in this browser.",
  },
  videoPage: {
    eyebrow: "TalkNest Podcast",
    title: "Conversations about books, authors and stories",
    description:
      "A new episode every week — author interviews, book reviews, reader stories and quizzes. Click any episode to watch it in the YouTube player.",
    pills: [
      "New episode every Thursday",
      "Plays directly on YouTube",
      "Authors and readers in conversation",
    ],
    promoEyebrow: "Quiz section",
    promoTitle: "Two quizzes, one page.",
    promoText:
      "Watch an episode and take the Watch & Quiz, or jump straight into the Book Quiz and this week's leaderboard.",
  },
  quizPage: {
    eyebrow: "TalkNest Quiz",
    title: "Two quizzes, one reading break.",
    description:
      "Watch an episode and take the quiz right below it, or jump straight into the book quiz. Every answer comes with a short explanation.",
    pills: ["Watch & Quiz", "Book Quiz", "questions", "Bookworm Champion"],
  },
  videos,
  quizzes: quizQuestions.map(toQuestion),
  comments: [
    ...demoComments.video.map((item) => ({
      ...item,
      target: "video" as const,
      userName: item.userId,
    })),
    ...demoComments.quiz.map((item) => ({
      ...item,
      target: "quiz" as const,
      userName: item.userId,
    })),
  ],
};

export function cloneVideoQuizDefaults(): VideoQuizContent {
  return JSON.parse(JSON.stringify(videoQuizDefaults)) as VideoQuizContent;
}

function isVideo(value: unknown): value is TalkVideo {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.category === "string" &&
    typeof item.duration === "string" &&
    typeof item.views === "string" &&
    typeof item.thumbnail === "string" &&
    typeof item.youtubeId === "string" &&
    typeof item.host === "string" &&
    typeof item.episode === "number"
  );
}

function isQuestion(value: unknown): value is VideoQuizQuestion {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.question === "string" &&
    Array.isArray(item.options) &&
    item.options.every((option) => typeof option === "string") &&
    typeof item.answerIndex === "number" &&
    typeof item.explanation === "string" &&
    typeof item.videoId === "string"
  );
}

function isComment(value: unknown): value is VideoComment {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.userId === "string" &&
    typeof item.userName === "string" &&
    (item.target === "video" || item.target === "quiz") &&
    typeof item.text === "string" &&
    typeof item.time === "string" &&
    typeof item.likes === "number" &&
    (item.parentId === undefined || typeof item.parentId === "string")
  );
}

export function readVideoQuizContent(): VideoQuizContent {
  const defaults = cloneVideoQuizDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(VIDEO_QUIZ_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<VideoQuizContent>;
    if (
      !Array.isArray(parsed.videos) ||
      !parsed.videos.every(isVideo) ||
      !Array.isArray(parsed.quizzes) ||
      !parsed.quizzes.every(isQuestion) ||
      !Array.isArray(parsed.comments) ||
      !parsed.comments.every(isComment)
    ) {
      return defaults;
    }
    return {
      section: { ...defaults.section, ...parsed.section },
      home: { ...defaults.home, ...parsed.home },
      videoPage: {
        ...defaults.videoPage,
        ...parsed.videoPage,
        pills: Array.isArray(parsed.videoPage?.pills)
          ? parsed.videoPage.pills
          : defaults.videoPage.pills,
      },
      quizPage: {
        ...defaults.quizPage,
        ...parsed.quizPage,
        pills: Array.isArray(parsed.quizPage?.pills)
          ? parsed.quizPage.pills
          : defaults.quizPage.pills,
      },
      videos: parsed.videos,
      quizzes: parsed.quizzes,
      comments: parsed.comments,
    };
  } catch {
    return defaults;
  }
}

export function writeVideoQuizContent(content: VideoQuizContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(VIDEO_QUIZ_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — video and quiz pages updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearVideoQuizContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(VIDEO_QUIZ_STORAGE_KEY);
    return { ok: true, message: "Restored the original videos and quizzes." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
