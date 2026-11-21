/** Runtime validation for the API-driven video/quiz system. */
import { z } from "zod";

import { parseYouTubeId } from "@/lib/youtube";

const safeText = (max: number) => z.string().trim().max(max);
const mediaUrl = (value: string) =>
  (value.startsWith("/media/") || /^https?:\/\//i.test(value)) && !value.startsWith("data:");

export const videoQuizCopySchema = z.object({
  section: z.object({
    eyebrow: safeText(120),
    title: safeText(200),
    description: safeText(800),
    linkLabel: safeText(80),
  }),
  home: z.object({
    title: safeText(200),
    description: safeText(1200),
    progressPrefix: safeText(40),
    progressSuffix: safeText(80),
    quizTitle: safeText(200),
    quizText: safeText(200),
    quizNote: safeText(800),
    allWatchedNote: safeText(200),
    watchedSoFarNote: safeText(200),
    demoNote: safeText(600),
  }),
  videoPage: z.object({
    eyebrow: safeText(120),
    title: safeText(200),
    description: safeText(1200),
    pills: z.array(safeText(160)).max(12),
    promoEyebrow: safeText(120),
    promoTitle: safeText(200),
    promoText: safeText(800),
  }),
  quizPage: z.object({
    eyebrow: safeText(120),
    title: safeText(200),
    description: safeText(1200),
    pills: z.array(safeText(160)).max(12),
  }),
});

const videoBase = z.object({
  title: z.string().trim().min(2).max(200),
  description: safeText(5000),
  category: z.string().trim().min(1).max(80),
  host: z.string().trim().min(1).max(100),
  episode: z.number().int().min(0).max(99999),
  duration: z.string().trim().min(1).max(30),
  views: z.string().trim().min(1).max(30),
  thumbnail: z
    .string()
    .trim()
    .max(2048)
    .refine(mediaUrl, "Thumbnail must be a /media path or http(s) URL"),
  source: z.enum(["youtube", "upload"]),
  /** A YouTube URL or id — normalised on the server before it is stored. */
  youtubeUrl: z.string().trim().max(300).optional().default(""),
  /** /media/video/<hash>.mp4 chosen from a previous server upload. */
  videoUrl: z.string().trim().max(2048).optional().default(""),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
});

export const createVideoSchema = videoBase.superRefine((value, context) => {
  if (value.source === "youtube" && !parseYouTubeId(value.youtubeUrl ?? "")) {
    context.addIssue({
      code: "custom",
      path: ["youtubeUrl"],
      message: "Enter a valid YouTube URL or 11-character video id.",
    });
  }
  if (value.source === "upload" && !mediaUrl(value.videoUrl ?? "")) {
    context.addIssue({
      code: "custom",
      path: ["videoUrl"],
      message: "Upload an MP4/WebM file or provide a /media video URL.",
    });
  }
});

export const updateVideoSchema = videoBase.partial().extend({
  id: z.string().trim().min(1).max(80),
});

const questionSchema = z.object({
  id: z.string().trim().min(1).max(80).optional(),
  question: z.string().trim().min(3).max(600),
  options: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
  answerIndex: z.number().int().min(0),
  explanation: safeText(1200),
  marks: z.number().int().min(1).max(100),
});

const quizBase = z.object({
  title: z.string().trim().min(2).max(200),
  description: safeText(3000),
  category: z.string().trim().min(1).max(80),
  instructions: safeText(2000),
  type: z.enum(["book", "watch", "general"]),
  videoId: z.string().trim().max(80).nullable().optional(),
  durationMinutes: z.number().int().min(0).max(240),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
  questions: z.array(questionSchema).min(1).max(100),
});

export const createQuizSchema = quizBase.superRefine((value, context) => {
  value.questions.forEach((question, index) => {
    if (question.answerIndex >= question.options.length) {
      context.addIssue({
        code: "custom",
        path: ["questions", index, "answerIndex"],
        message: "The correct answer must be one of the options.",
      });
    }
    if (new Set(question.options).size !== question.options.length) {
      context.addIssue({
        code: "custom",
        path: ["questions", index, "options"],
        message: "Answer options must be unique.",
      });
    }
  });
});

// The patch only needs shape checks here; the action merges the patch with the
// stored quiz and validates the complete document with createQuizSchema.
export const updateQuizSchema = quizBase.partial().extend({
  id: z.string().trim().min(1).max(80),
});

export const idSchema = z.object({
  id: z.string().trim().min(1).max(80),
});

export const discussionCreateSchema = z.object({
  target: z.enum(["video", "quiz"]),
  targetId: z.string().trim().min(1).max(80),
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().trim().max(80).nullable().optional(),
});

export const discussionModerateSchema = z.object({
  id: z.string().trim().min(1).max(80),
  status: z.enum(["visible", "hidden"]).optional(),
  body: z.string().trim().min(1).max(2000).optional(),
});

/** The browser sends answers only — score and rank are always server-side. */
export const quizAttemptSchema = z.object({
  answers: z.array(z.number().int().min(0).max(5)).max(100),
  seconds: z.number().int().min(0).max(86400).optional().default(0),
});

export const adminReplySchema = z.object({
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().trim().min(1).max(80),
  target: z.enum(["video", "quiz"]),
  targetId: z.string().trim().min(1).max(80),
});
